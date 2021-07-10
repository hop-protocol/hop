import ContractBase from './ContractBase'
import db from 'src/db'
import delay from 'src/decorators/delay'
import queue from 'src/decorators/queue'
import rateLimitRetry, { rateLimitRetryFn } from 'src/decorators/rateLimitRetry'
import unique from 'src/utils/unique'
import { BigNumber, Contract, Event, constants, providers } from 'ethers'
import { boundClass } from 'autobind-decorator'
import { config } from 'src/config'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { isL1ChainId, xor } from 'src/utils'

export type EventsBatchOptions = {
  cacheKey: string
  startBlockNumber: number
  endBlockNumber: number
}

export type EventCb = (event: Event, i?: number) => any

@boundClass
export default class Bridge extends ContractBase {
  WithdrawalBonded: string = 'WithdrawalBonded'
  TransferRootSet: string = 'TransferRootSet'
  MultipleWithdrawalsSettled: string = 'MultipleWithdrawalsSettled'
  tokenDecimals: number = 18
  tokenSymbol: string = ''
  bridgeContract: Contract
  readProvider?: providers.Provider

  constructor (bridgeContract: Contract) {
    super(bridgeContract)
    this.bridgeContract = bridgeContract
    let tokenDecimals: number
    let tokenSymbol: string
    // TODO: better way of getting token decimals
    for (const tkn in config.tokens) {
      for (const key in config.tokens[tkn]) {
        for (const net in config.tokens[tkn]) {
          for (const k in config.tokens[tkn][net]) {
            const val = config.tokens[tkn][net][k]
            if (val === bridgeContract.address) {
              tokenDecimals = (config.metadata.tokens[config.network] as any)[
                tkn
              ].decimals
              tokenSymbol = (config.metadata.tokens[config.network] as any)[tkn]
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
    this.bridgeStartListeners()
  }

  // a read provider is alternative provider that can be used only for
  // contract read operations.
  // a read provider is optional.
  setReadProvider (provider: providers.Provider): void {
    this.readProvider = provider
  }

  // if there is no alternative read provider, then use the default provider.
  getReadBridgeContract (): Contract {
    return this.readProvider
      ? this.bridgeContract?.connect(this.readProvider)
      : this.bridgeContract
  }

  // the write provider is the default provider used, so there's
  // no need to connect another provider here.
  getWriteBridgeContract (): Contract {
    return this.bridgeContract
  }

  bridgeStartListeners (): void {
    this.getReadBridgeContract()
      .on(this.bridgeContract.filters.WithdrawalBonded(), (...args: any[]) =>
        this.emit(this.WithdrawalBonded, ...args)
      )
      .on(this.bridgeContract.filters.TransferRootSet(), (...args: any[]) =>
        this.emit(this.TransferRootSet, ...args)
      )
      .on(
        this.bridgeContract.filters.MultipleWithdrawalsSettled(),
        (...args: any[]) => this.emit(this.MultipleWithdrawalsSettled, ...args)
      )
      .on('error', err => {
        this.emit('error', err)
      })
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
    if (Array.isArray(config?.bonders)) {
      bonders = unique([bonderAddress, ...config.bonders])
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
    return this.getReadBridgeContract().queryFilter(
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
    for (const key in config.networks) {
      const { networkId: chainId } = config.networks[key]
      chainIds.push(chainId)
    }
    return chainIds
  }

  async getL1ChainId (): Promise<number> {
    for (const key in config.networks) {
      const { networkId: chainId } = config.networks[key]
      if (isL1ChainId(chainId)) {
        return chainId
      }
    }
  }

  async getL2ChainIds (): Promise<number[]> {
    const chainIds: number[] = []
    for (const key in config.networks) {
      const { networkId: chainId } = config.networks[key]
      if (isL1ChainId(chainId)) {
        continue
      }
      chainIds.push(chainId)
    }
    return chainIds
  }

  getMinBondWithdrawalAmount (): BigNumber {
    const amount = config?.bondWithdrawals?.[this.chainSlug]?.[this.tokenSymbol]?.min ?? 0
    return this.parseUnits(amount)
  }

  getMaxBondWithdrawalAmount (): BigNumber {
    const amount = config?.bondWithdrawals?.[this.chainSlug]?.[this.tokenSymbol]?.max ?? 0
    return amount ? this.parseUnits(amount) : constants.MaxUint256
  }

  @queue
  @delay
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
  @delay
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
  async waitSafeConfirmationsAndCheckBlockNumber (
    originalTxHash: string,
    txHashGetter: () => Promise<string>
  ) {
    const originalBlockNumber = await this.getTransactionBlockNumber(
      originalTxHash
    )
    await this.waitSafeConfirmations(originalBlockNumber)
    const latestTxHash = await txHashGetter()
    if (!latestTxHash) {
      throw new Error('could not find tx hash event')
    }
    const latestBlockNumber = await this.getTransactionBlockNumber(latestTxHash)
    if (originalBlockNumber !== latestBlockNumber) {
      throw new Error(
        `tx hash (${originalTxHash}) block number hash changed. expected ${originalBlockNumber}, got ${latestBlockNumber}`
      )
    }
  }

  formatUnits (value: BigNumber) {
    return Number(formatUnits(value.toString(), this.tokenDecimals))
  }

  parseUnits (value: string | number) {
    return parseUnits(value.toString(), this.tokenDecimals)
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
    await this.waitTilReady()
    this.validateEventsBatchInput(options)

    let cacheKey = ''
    let state
    if (options?.cacheKey) {
      cacheKey = this.getCacheKeyFromKey(
        this.chainId,
        this.address,
        options.cacheKey
      )
      state = await db.syncState.getByKey(cacheKey)
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
      await db.syncState.update(cacheKey, {
        latestBlockSynced: latestBlockInBatch,
        timestamp: Date.now()
      })
    }
  }

  private getBlockValues = async (options: any, state: any) => {
    const { startBlockNumber, endBlockNumber } = options

    let end
    let start
    let totalBlocksInBatch
    const { totalBlocks, batchBlocks } = config.sync[this.chainSlug]
    const currentBlockNumber = await this.getBlockNumber()

    if (startBlockNumber && endBlockNumber) {
      end = endBlockNumber
      totalBlocksInBatch = end - startBlockNumber
    } else if (state?.latestBlockSynced) {
      end = currentBlockNumber
      totalBlocksInBatch = end - state.latestBlockSynced
    } else {
      end = currentBlockNumber
      totalBlocksInBatch = totalBlocks
      // Handle the case where the chain has less blocks than the total block config
      // This may happen during an Optimism regensis, for example
      if (end - totalBlocksInBatch < 0) {
        totalBlocksInBatch = end
      }
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

    const doesOnlyStartOrEndExist = xor(startBlockNumber, endBlockNumber)
    if (doesOnlyStartOrEndExist) {
      throw new Error(
        'If either a start or end block number exist, both must exist'
      )
    }

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
