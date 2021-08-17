import ContractBase from './ContractBase'
import delay from 'src/decorators/delay'
import queue from 'src/decorators/queue'
import rateLimitRetry, { rateLimitRetryFn } from 'src/decorators/rateLimitRetry'
import unique from 'src/utils/unique'
import { BigNumber, Contract, constants, utils as ethersUtils, providers } from 'ethers'
import { Chain } from 'src/constants'
import { Db, getDbSet } from 'src/db'
import { Event } from 'src/types'
import { State } from 'src/db/SyncStateDb'
import { boundClass } from 'autobind-decorator'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { config as globalConfig } from 'src/config'
import { isL1ChainId } from 'src/utils'

export type EventsBatchOptions = {
  cacheKey: string
  startBlockNumber: number
  endBlockNumber: number
}

export type EventCb = (event: Event, i?: number) => any

@boundClass
export default class Bridge extends ContractBase {
  db: Db
  WithdrawalBonded: string = 'WithdrawalBonded'
  TransferRootSet: string = 'TransferRootSet'
  MultipleWithdrawalsSettled: string = 'MultipleWithdrawalsSettled'
  tokenDecimals: number = 18
  tokenSymbol: string = ''
  bridgeContract: Contract
  readProvider?: providers.Provider
  specialReadProvider?: providers.Provider
  bridgeDeployedBlockNumber: number
  l1CanonicalTokenAddress: string
  minBondWithdrawalAmount: BigNumber
  maxBondWithdrawalAmount: BigNumber
  stateUpdateAddress: string

  constructor (bridgeContract: Contract) {
    super(bridgeContract)
    this.bridgeContract = bridgeContract
    let tokenDecimals: number
    let tokenSymbol: string
    // TODO: better way of getting token decimals
    for (const tkn in globalConfig.tokens) {
      for (const key in globalConfig.tokens[tkn]) {
        for (const net in globalConfig.tokens[tkn]) {
          for (const k in globalConfig.tokens[tkn][net]) {
            const val = globalConfig.tokens[tkn][net][k]
            if (val === bridgeContract.address) {
              tokenDecimals = globalConfig.metadata.tokens[
                tkn
              ].decimals
              tokenSymbol = globalConfig.metadata.tokens[tkn]
                .symbol
              break
            }
          }
        }
      }
    }
    if (tokenDecimals !== undefined) {
      this.tokenDecimals = tokenDecimals
    }
    if (tokenSymbol) {
      this.tokenSymbol = tokenSymbol
    }
    this.db = getDbSet(this.tokenSymbol)
    const bridgeDeployedBlockNumber = globalConfig.tokens[this.tokenSymbol]?.[this.chainSlug]?.bridgeDeployedBlockNumber
    const l1CanonicalTokenAddress = globalConfig.tokens[this.tokenSymbol]?.[Chain.Ethereum]?.l1CanonicalToken
    if (!bridgeDeployedBlockNumber) {
      throw new Error('bridge deployed block number is required')
    }
    if (!l1CanonicalTokenAddress) {
      throw new Error('L1 token address is required')
    }
    this.bridgeDeployedBlockNumber = bridgeDeployedBlockNumber
    this.l1CanonicalTokenAddress = l1CanonicalTokenAddress

    const minBondWithdrawalAmount: number = globalConfig?.bondWithdrawals?.[this.chainSlug]?.[this.tokenSymbol]?.min ?? 0
    const maxBondWithdrawalAmount: number = globalConfig?.bondWithdrawals?.[this.chainSlug]?.[this.tokenSymbol]?.max
    this.minBondWithdrawalAmount = this.parseUnits(minBondWithdrawalAmount)
    this.maxBondWithdrawalAmount = maxBondWithdrawalAmount ? this.parseUnits(maxBondWithdrawalAmount) : constants.MaxUint256
    this.stateUpdateAddress = globalConfig?.stateUpdateAddress
  }

  // a read provider is alternative provider that can be used only for
  // contract read operations.
  // a read provider is optional.
  setReadProvider (provider: providers.Provider): void {
    this.readProvider = provider
  }

  // the special read provider is a read provider that's meant to be used
  // for very specific events that the regular read provider doesn't provide.
  // This is specific to polygon only.
  setSpecialReadProvider (provider: providers.Provider): void {
    this.specialReadProvider = provider
  }

  // if there is no alternative read provider, then use the default provider.
  getReadBridgeContract (): Contract {
    return this.readProvider
      ? this.bridgeContract?.connect(this.readProvider)
      : this.bridgeContract
  }

  getSpecialReadBridgeContract (): Contract {
    return this.specialReadProvider
      ? this.bridgeContract?.connect(this.specialReadProvider)
      : this.getReadBridgeContract()
  }

  // the write provider is the default provider used, so there's
  // no need to connect another provider here.
  getWriteBridgeContract (): Contract {
    return this.bridgeContract
  }

  async getBonderAddress (): Promise<string> {
    return this.getWriteBridgeContract().signer.getAddress()
  }

  @rateLimitRetry
  async isBonder (): Promise<boolean> {
    const bonder = await this.getBonderAddress()
    return this.getReadBridgeContract().getIsBonder(bonder)
  }

  @rateLimitRetry
  async getCredit (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    const credit = await this.getReadBridgeContract().getCredit(bonder)
    return credit
  }

  @rateLimitRetry
  async getDebit (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    const debit = await this.getReadBridgeContract().getDebitAndAdditionalDebit(
      bonder
    )
    return debit
  }

  @rateLimitRetry
  async getRawDebit (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    const debit = await this.getReadBridgeContract().getRawDebit(bonder)
    return debit
  }

  @rateLimitRetry
  async getAvailableCredit (): Promise<BigNumber> {
    const [credit, debit] = await Promise.all([
      this.getCredit(),
      this.getDebit()
    ])
    return credit.sub(debit)
  }

  @rateLimitRetry
  async hasPositiveBalance (): Promise<boolean> {
    const credit = await this.getAvailableCredit()
    return credit.gt(0)
  }

  getAddress (): string {
    return this.getReadBridgeContract().address
  }

  async getBondedWithdrawalAmount (transferId: string): Promise<BigNumber> {
    const bonderAddress = await this.getBonderAddress()
    return this.getBondedWithdrawalAmountByBonder(bonderAddress, transferId)
  }

  @rateLimitRetry
  async getBondedWithdrawalAmountByBonder (
    bonder: string,
    transferId: string
  ): Promise<BigNumber> {
    const bondedBn = await this.getReadBridgeContract().getBondedWithdrawalAmount(
      bonder,
      transferId
    )
    return bondedBn
  }

  async getTotalBondedWithdrawalAmount (
    transferId: string
  ): Promise<BigNumber> {
    let totalBondedAmount = BigNumber.from(0)
    const bonderAddress = await this.getBonderAddress()
    let bonders = [bonderAddress]
    if (globalConfig?.bonders?.[this.tokenSymbol]) {
      bonders = unique([bonderAddress, ...globalConfig.bonders[this.tokenSymbol]])
    }
    for (const bonder of bonders) {
      const bondedAmount = await this.getBondedWithdrawalAmountByBonder(
        bonder,
        transferId
      )
      totalBondedAmount = totalBondedAmount.add(bondedAmount)
    }
    return totalBondedAmount
  }

  @rateLimitRetry
  async getBonderBondedWithdrawalsBalance (): Promise<BigNumber> {
    const bonderAddress = await this.getBonderAddress()
    let total = BigNumber.from(0)
    await this.eventsBatch(async (start: number, end: number) => {
      const withdrawalBondedEvents = await this.getWithdrawalBondedEvents(
        start,
        end
      )
      for (const event of withdrawalBondedEvents) {
        const { transferId } = event.args
        const amount = await this.getBondedWithdrawalAmountByBonder(
          bonderAddress,
          transferId
        )
        total = total.add(amount)
      }
    })
    return total
  }

  async getBondedWithdrawalTimestamp (
    transferId: string,
    startBlockNumber?: number,
    endBlockNumber?: number
  ): Promise<number> {
    const event = await this.getBondedWithdrawalEvent(
      transferId,
      startBlockNumber,
      endBlockNumber
    )
    if (!event) {
      return 0
    }
    return this.getEventTimestamp(event)
  }

  async getBondedWithdrawalEvent (
    transferId: string,
    startBlockNumber?: number,
    endBlockNumber?: number
  ): Promise<any> {
    let match: Event = null
    await this.eventsBatch(
      async (start: number, end: number) => {
        const events = await this.getWithdrawalBondedEvents(start, end)
        for (const event of events) {
          if (event.args.transferId === transferId) {
            match = event
            return false
          }
        }
      },
      {
        startBlockNumber,
        endBlockNumber
      }
    )

    return match
  }

  @rateLimitRetry
  isTransferIdSpent (transferId: string): Promise<boolean> {
    return this.getReadBridgeContract().isTransferIdSpent(transferId)
  }

  @rateLimitRetry
  async getWithdrawalBondedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> {
    return this.getReadBridgeContract().queryFilter(
      this.getReadBridgeContract().filters.WithdrawalBonded(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapWithdrawalBondedEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getWithdrawalBondedEvents, cb, options)
  }

  @rateLimitRetry
  async getTransferRootSetEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> {
    return this.getSpecialReadBridgeContract().queryFilter(
      this.getReadBridgeContract().filters.TransferRootSet(),
      startBlockNumber,
      endBlockNumber
    )
  }

  @rateLimitRetry
  async getTransferRootSetTxHash (
    transferRootHash: string
  ): Promise<string | undefined> {
    let txHash: string
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getReadBridgeContract().queryFilter(
        this.getReadBridgeContract().filters.TransferRootSet(),
        start,
        end
      )

      for (const event of events) {
        if (transferRootHash === event.args.rootHash) {
          txHash = event.transactionHash
          return false
        }
      }
      return true
    })

    return txHash
  }

  async mapTransferRootSetEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getTransferRootSetEvents, cb, options)
  }

  @rateLimitRetry
  async getWithdrawalBondSettledEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> {
    return this.getReadBridgeContract().queryFilter(
      this.getReadBridgeContract().filters.WithdrawalBondSettled(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async decodeSettleBondedWithdrawalData (data: string): Promise<any> {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = await this.getReadBridgeContract().interface.decodeFunctionData(
      'settleBondedWithdrawal',
      data
    )

    const bonder = decoded.bonder
    const transferId = decoded.transferId.toString()
    const rootHash = decoded.rootHash.toString()
    const transferRootTotalAmount = decoded.transferRootTotalAmount
    const transferIdTreeIndex = Number(decoded.transferIdTreeIndex.toString())
    const siblings = decoded.siblings.map((sibling: any) => sibling.toString())
    const totalLeaves = Number(decoded.totalLeaves.toString())

    return {
      bonder,
      transferId,
      rootHash,
      transferRootTotalAmount,
      transferIdTreeIndex,
      siblings,
      totalLeaves
    }
  }

  @rateLimitRetry
  async getMultipleWithdrawalsSettledEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> {
    return this.getReadBridgeContract().queryFilter(
      this.getReadBridgeContract().filters.MultipleWithdrawalsSettled(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapMultipleWithdrawalsSettledEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(
      this.getMultipleWithdrawalsSettledEvents,
      cb,
      options
    )
  }

  @rateLimitRetry
  async decodeSettleBondedWithdrawalsData (data: string): Promise<any> {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = await this.getReadBridgeContract().interface.decodeFunctionData(
      'settleBondedWithdrawals',
      data
    )
    const bonder = decoded.bonder
    const transferIds = decoded.transferIds.map((transferId: any) =>
      transferId.toString()
    )
    const totalAmount = decoded.totalAmount

    return {
      bonder,
      transferIds,
      totalAmount
    }
  }

  @rateLimitRetry
  async getTransferRootId (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<string> {
    return this.getReadBridgeContract().getTransferRootId(
      transferRootHash,
      totalAmount
    )
  }

  @rateLimitRetry
  async getTransferRoot (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<any> {
    return this.getReadBridgeContract().getTransferRoot(
      transferRootHash,
      totalAmount
    )
  }

  // get the chain ids of all bridged L2s and L1
  async getChainIds (): Promise<number[]> {
    const chainIds: number[] = []
    for (const key in globalConfig.networks) {
      const { networkId: chainId } = globalConfig.networks[key]
      chainIds.push(chainId)
    }
    return chainIds
  }

  async getL1ChainId (): Promise<number> {
    for (const key in globalConfig.networks) {
      const { networkId: chainId } = globalConfig.networks[key]
      if (isL1ChainId(chainId)) {
        return chainId
      }
    }
  }

  async getL2ChainIds (): Promise<number[]> {
    const chainIds: number[] = []
    for (const key in globalConfig.networks) {
      const { networkId: chainId } = globalConfig.networks[key]
      if (isL1ChainId(chainId)) {
        continue
      }
      chainIds.push(chainId)
    }
    return chainIds
  }

  @queue
  @rateLimitRetry
  async stake (amount: BigNumber): Promise<providers.TransactionResponse> {
    const bonder = await this.getBonderAddress()
    const tx = await this.getWriteBridgeContract().stake(
      bonder,
      amount,
      await this.txOverrides()
    )

    return tx
  }

  @queue
  @rateLimitRetry
  async unstake (amount: BigNumber): Promise<providers.TransactionResponse> {
    const bonder = await this.getBonderAddress()
    const tx = await this.getWriteBridgeContract().unstake(
      amount,
      await this.txOverrides()
    )
    return tx
  }

  @queue
  @delay
  @rateLimitRetry
  async bondWithdrawal (
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber
  ): Promise<providers.TransactionResponse> {
    const tx = await this.getWriteBridgeContract().bondWithdrawal(
      recipient,
      amount,
      transferNonce,
      bonderFee,
      await this.txOverrides()
    )

    return tx
  }

  @queue
  @delay
  @rateLimitRetry
  async settleBondedWithdrawals (
    bonder: string,
    transferIds: string[],
    amount: BigNumber
  ): Promise<providers.TransactionResponse> {
    const tx = await this.getWriteBridgeContract().settleBondedWithdrawals(
      bonder,
      transferIds,
      amount,
      await this.txOverrides()
    )

    return tx
  }

  @rateLimitRetry
  async getStateUpdateStatus (stateUpdateAddress: string, chainId: number): Promise<number> {
    const abi = ['function currentState(address,uint256)']
    const ethersInterface = new ethersUtils.Interface(abi)
    const data = ethersInterface.encodeFunctionData(
      'currentState', [this.l1CanonicalTokenAddress, chainId]
    )
    const tx = {
      to: stateUpdateAddress,
      data
    }
    const res: string = await this.contract.provider.call(tx)
    return Number(res)
  }

  @rateLimitRetry
  async getEthBalance (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    return this.getBalance(bonder)
  }

  formatUnits (value: BigNumber) {
    return Number(formatUnits(value.toString(), this.tokenDecimals))
  }

  parseUnits (value: string | number) {
    return parseUnits(value.toString(), this.tokenDecimals)
  }

  formatEth (value: BigNumber) {
    return Number(formatUnits(value.toString(), 18))
  }

  parseEth (value: string | number) {
    return parseUnits(value.toString(), 18)
  }

  protected async mapEventsBatch (
    getEventsMethod: (start: number, end: number) => Promise<Event[]>,
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    let i = 0
    const promises: Promise<any>[] = []
    await this.eventsBatch(async (start: number, end: number) => {
      let events = await rateLimitRetryFn(getEventsMethod)(start, end, i)
      events = events.reverse()
      for (const event of events) {
        promises.push(cb(event, i++))
      }
    }, options)
    return Promise.all(promises)
  }

  public async eventsBatch (
    cb: (start?: number, end?: number, i?: number) => Promise<void | boolean>,
    options: Partial<EventsBatchOptions> = {}
  ) {
    this.validateEventsBatchInput(options)

    let cacheKey = ''
    let state: State
    if (options?.cacheKey) {
      cacheKey = this.getCacheKeyFromKey(
        this.chainId,
        this.address,
        options.cacheKey
      )
      state = await this.db.syncState.getByKey(cacheKey)
    }

    let {
      start,
      end,
      batchBlocks,
      earliestBlockInBatch,
      latestBlockInBatch
    } = await this.getBlockValues(options, state)

    let i = 0
    while (start >= earliestBlockInBatch) {
      const shouldContinue = await rateLimitRetryFn(cb)(start, end, i)
      if (
        (typeof shouldContinue === 'boolean' && !shouldContinue) ||
        start === earliestBlockInBatch
      ) {
        break
      }

      // Subtract 1 so that the boundary blocks are not double counted
      end = start - 1
      start = end - batchBlocks

      if (start < earliestBlockInBatch) {
        start = earliestBlockInBatch
      }
      i++
    }

    // Only store latest block if a full sync is successful.
    // Sync is complete when the start block is reached since
    // it traverses backwards from head.
    if (cacheKey && start === earliestBlockInBatch) {
      await this.db.syncState.update(cacheKey, {
        latestBlockSynced: latestBlockInBatch,
        timestamp: Date.now()
      })
    }
  }

  private getBlockValues = async (options: any, state: State) => {
    const { startBlockNumber, endBlockNumber } = options

    let end
    let start
    let totalBlocksInBatch
    const { totalBlocks, batchBlocks } = globalConfig.sync[this.chainSlug]
    const currentBlockNumber = await this.getBlockNumber()
    const currentBlockNumberWithFinality = currentBlockNumber - this.waitConfirmations
    const isInitialSync = !state?.latestBlockSynced && startBlockNumber && !endBlockNumber
    const isSync = state?.latestBlockSynced && startBlockNumber && !endBlockNumber

    if (startBlockNumber && endBlockNumber) {
      end = endBlockNumber
      totalBlocksInBatch = end - startBlockNumber
    } else if (endBlockNumber) {
      end = endBlockNumber
      totalBlocksInBatch = totalBlocks
    } else if (isInitialSync) {
      end = currentBlockNumberWithFinality
      totalBlocksInBatch = end - startBlockNumber
    } else if (isSync) {
      end = Math.max(currentBlockNumberWithFinality, state.latestBlockSynced)
      totalBlocksInBatch = end - state.latestBlockSynced
    } else {
      end = currentBlockNumberWithFinality
      totalBlocksInBatch = totalBlocks
    }

    // Handle the case where the chain has less blocks than the total block config
    // This may happen during an Optimism regensis, for example
    if (end - totalBlocksInBatch < 0) {
      totalBlocksInBatch = end
    }

    if (totalBlocksInBatch <= batchBlocks) {
      start = end - totalBlocksInBatch
    } else {
      start = end - batchBlocks
    }

    const earliestBlockInBatch = end - totalBlocksInBatch
    const latestBlockInBatch = end

    // NOTE: We do not handle the case where end minus batchBlocks is
    // a negative, which should never happen

    return {
      start,
      end,
      batchBlocks,
      earliestBlockInBatch,
      latestBlockInBatch
    }
  }

  public getCacheKeyFromKey = (
    chainId: number,
    address: string,
    key: string
  ) => {
    return `${chainId}:${address}:${key}`
  }

  private validateEventsBatchInput = (
    options: Partial<EventsBatchOptions> = {}
  ) => {
    const { cacheKey, startBlockNumber, endBlockNumber } = options

    const isStartAndEndBlock = startBlockNumber && endBlockNumber
    if (isStartAndEndBlock) {
      if (startBlockNumber >= endBlockNumber) {
        throw new Error(
          'Cannot pass in an end block that is before a start block'
        )
      }

      if (startBlockNumber < 0 || endBlockNumber < 0) {
        throw new Error(
          'Cannot pass in a start or end block that is less than 0'
        )
      }

      if (cacheKey) {
        throw new Error(
          'A key cannot exist when a start and end block are explicitly defined'
        )
      }
    }
  }
}
