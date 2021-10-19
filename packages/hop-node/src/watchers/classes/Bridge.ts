import ContractBase from './ContractBase'
import getBumpedGasPrice from 'src/utils/getBumpedGasPrice'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import getTokenMetadataByAddress from 'src/utils/getTokenMetadataByAddress'
import getTransferRootId from 'src/utils/getTransferRootId'
import isL1ChainId from 'src/utils/isL1ChainId'
import rateLimitRetry from 'src/utils/rateLimitRetry'
import shiftBNDecimals from 'src/utils/shiftBNDecimals'
import { BigNumber, Contract, utils as ethersUtils, providers } from 'ethers'
import { BonderFeeBps, Chain, MaxGasPriceMultiplier, MinBonderFeeAbsolute } from 'src/constants'
import { BonderFeeTooLowError } from 'src/types/error'
import { DbSet, getDbSet } from 'src/db'
import { Event } from 'src/types'
import { PriceFeed } from 'src/priceFeed'
import { State } from 'src/db/SyncStateDb'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { config as globalConfig } from 'src/config'

export type EventsBatchOptions = {
  cacheKey: string
  startBlockNumber: number
  endBlockNumber: number
}

export type EventCb = (event: Event, i?: number) => any

const priceFeed = new PriceFeed()

export default class Bridge extends ContractBase {
  db: DbSet
  WithdrawalBonded: string = 'WithdrawalBonded'
  Withdrew: string = 'Withdrew'
  TransferRootSet: string = 'TransferRootSet'
  MultipleWithdrawalsSettled: string = 'MultipleWithdrawalsSettled'
  tokenDecimals: number = 18
  tokenSymbol: string = ''
  bridgeContract: Contract
  bridgeDeployedBlockNumber: number
  l1CanonicalTokenAddress: string
  stateUpdateAddress: string

  constructor (bridgeContract: Contract) {
    super(bridgeContract)
    this.bridgeContract = bridgeContract
    const metadata = getTokenMetadataByAddress(bridgeContract.address, this.chainSlug)
    const tokenDecimals: number = metadata?.decimals
    const tokenSymbol: string = metadata?.symbol

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
    this.stateUpdateAddress = globalConfig?.stateUpdateAddress
  }

  async getBonderAddress (): Promise<string> {
    return this.bridgeContract.signer.getAddress()
  }

  isBonder = rateLimitRetry(async (): Promise<boolean> => {
    const bonder = await this.getBonderAddress()
    return this.bridgeContract.getIsBonder(bonder)
  })

  getCredit = rateLimitRetry(async (bonder?: string): Promise<BigNumber> => {
    if (!bonder) {
      bonder = await this.getBonderAddress()
    }
    const credit = await this.bridgeContract.getCredit(bonder)
    return credit
  })

  getDebit = rateLimitRetry(async (bonder?: string): Promise<BigNumber> => {
    if (!bonder) {
      bonder = await this.getBonderAddress()
    }
    const debit = await this.bridgeContract.getDebitAndAdditionalDebit(
      bonder
    )
    return debit
  })

  getRawDebit = rateLimitRetry(async (): Promise<BigNumber> => {
    const bonder = await this.getBonderAddress()
    const debit = await this.bridgeContract.getRawDebit(bonder)
    return debit
  })

  async getBaseAvailableCredit (bonder?: string): Promise<BigNumber> {
    const [credit, debit] = await Promise.all([
      this.getCredit(bonder),
      this.getDebit(bonder)
    ])
    return credit.sub(debit)
  }

  async hasPositiveBalance (): Promise<boolean> {
    const credit = await this.getBaseAvailableCredit()
    return credit.gt(0)
  }

  getAddress (): string {
    return this.bridgeContract.address
  }

  async getBondedWithdrawalAmount (transferId: string): Promise<BigNumber> {
    const bonderAddress = await this.getBonderAddress()
    return this.getBondedWithdrawalAmountByBonder(bonderAddress, transferId)
  }

  getBondedWithdrawalAmountByBonder = rateLimitRetry(async (
    bonder: string,
    transferId: string
  ): Promise<BigNumber> => {
    const bondedBn = await this.bridgeContract.getBondedWithdrawalAmount(
      bonder,
      transferId
    )
    return bondedBn
  })

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

  async getWithdrewEvent (
    transferId: string,
    startBlockNumber?: number,
    endBlockNumber?: number
  ): Promise<any> {
    let match: Event = null
    await this.eventsBatch(
      async (start: number, end: number) => {
        const events = await this.getWithdrewEvents(start, end)
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

  isTransferIdSpent = rateLimitRetry((transferId: string): Promise<boolean> => {
    return this.bridgeContract.isTransferIdSpent(transferId)
  })

  getWithdrawalBondedEvents = rateLimitRetry((
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBonded(),
      startBlockNumber,
      endBlockNumber
    )
  })

  getWithdrewEvents = rateLimitRetry((
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.Withdrew(),
      startBlockNumber,
      endBlockNumber
    )
  })

  async mapWithdrawalBondedEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getWithdrawalBondedEvents, cb, options)
  }

  async mapWithdrewEvents (
    cb: EventCb,
    options?: Partial<EventsBatchOptions>
  ) {
    return this.mapEventsBatch(this.getWithdrewEvents, cb, options)
  }

  getTransferRootSetEvents = rateLimitRetry((
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootSet(),
      startBlockNumber,
      endBlockNumber
    )
  })

  async getTransferRootSetTxHash (
    transferRootHash: string
  ): Promise<string | undefined> {
    let txHash: string
    await this.eventsBatch(async (start: number, end: number) => {
      const events = await this.getTransferRootSetEvents(
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

  getWithdrawalBondSettledEvents = rateLimitRetry((
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBondSettled(),
      startBlockNumber,
      endBlockNumber
    )
  })

  decodeSettleBondedWithdrawalData (data: string): any {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = this.bridgeContract.interface.decodeFunctionData(
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

  getMultipleWithdrawalsSettledEvents = rateLimitRetry((
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<Event[]> => {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.MultipleWithdrawalsSettled(),
      startBlockNumber,
      endBlockNumber
    )
  })

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

  decodeSettleBondedWithdrawalsData (data: string): any {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = this.bridgeContract.interface.decodeFunctionData(
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

  getTransferRootId = (
    transferRootHash: string,
    totalAmount: BigNumber
  ): string => {
    return getTransferRootId(
      transferRootHash,
      totalAmount
    )
  }

  getTransferRoot = rateLimitRetry((
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<any> => {
    return this.bridgeContract.getTransferRoot(
      transferRootHash,
      totalAmount
    )
  })

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

  stake = rateLimitRetry(async (amount: BigNumber): Promise<providers.TransactionResponse> => {
    const bonder = await this.getBonderAddress()
    const txOverrides = await this.txOverrides()
    const isEthSend = this.chainSlug === Chain.Ethereum
    if (isEthSend) {
      txOverrides.value = amount
    }
    const tx = await this.bridgeContract.stake(
      bonder,
      amount,
      txOverrides
    )

    return tx
  })

  unstake = rateLimitRetry(async (amount: BigNumber): Promise<providers.TransactionResponse> => {
    const tx = await this.bridgeContract.unstake(
      amount,
      await this.txOverrides()
    )
    return tx
  })

  bondWithdrawal = rateLimitRetry(async (
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    gasPrice?: BigNumber,
    tokenUsdPrice?: number,
    chainNativeTokenUsdPrice?: number,
    gasCost?: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const txOverrides = await this.txOverrides()
    const payload = [
      recipient,
      amount,
      transferNonce,
      bonderFee,
      txOverrides
    ]

    const gasLimit = await this.bridgeContract.estimateGas.bondWithdrawal(...payload)
    await this.checkMinBonderFee(amount, bonderFee, gasLimit, this.chainSlug, this.tokenSymbol, gasPrice, tokenUsdPrice, chainNativeTokenUsdPrice, gasCost)

    const tx = await this.bridgeContract.bondWithdrawal(...payload)

    return tx
  })

  settleBondedWithdrawals = rateLimitRetry(async (
    bonder: string,
    transferIds: string[],
    amount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.bridgeContract.settleBondedWithdrawals(
      bonder,
      transferIds,
      amount,
      await this.txOverrides()
    )

    return tx
  })

  getStateUpdateStatus = rateLimitRetry(async (stateUpdateAddress: string, chainId: number): Promise<number> => {
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
  })

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
      rateLimitRetry(getEventsMethod)(start, end, i)
        .then((events: any[]) => {
          events = events.reverse()
          for (const event of events) {
            promises.push(cb(event, i))
          }
        })
      i++
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
      const shouldContinue = await rateLimitRetry(cb)(start, end, i)
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

  private getBlockValues = async (options: Partial<EventsBatchOptions>, state: State) => {
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

  shouldAttemptSwap (amountOutMin: BigNumber, deadline: BigNumber): boolean {
    return amountOutMin?.gt(0) || deadline?.gt(0)
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

  async compareBonderDestinationFeeCost (
    bonderFee: BigNumber,
    gasLimit: BigNumber,
    chain: string,
    tokenSymbol: string,
    gasPrice?: BigNumber,
    tokenUsdPrice?: number,
    chainNativeTokenUsdPrice?: number,
    gasCost?: BigNumber
  ) {
    const ethDecimals = 18
    const provider = getRpcProvider(chain)
    if (!gasPrice) {
      gasPrice = getBumpedGasPrice(await provider.getGasPrice(), MaxGasPriceMultiplier)
    }
    if (!tokenUsdPrice) {
      tokenUsdPrice = await priceFeed.getPriceByTokenSymbol(tokenSymbol)
    }
    if (!gasCost) {
      gasCost = gasLimit.mul(gasPrice)
    }
    const chainNativeTokenSymbol = this.getChainNativeTokenSymbol(chain)
    if (!chainNativeTokenUsdPrice) {
      chainNativeTokenUsdPrice = await priceFeed.getPriceByTokenSymbol(chainNativeTokenSymbol)
    }
    const tokenUsdPriceBn = parseUnits(tokenUsdPrice.toString(), ethDecimals)
    const chainNativeTokenUsdPriceBn = parseUnits(chainNativeTokenUsdPrice.toString(), ethDecimals)
    const tokenDecimals = getTokenDecimals(tokenSymbol)
    const bonderFee18d = shiftBNDecimals(bonderFee, ethDecimals - tokenDecimals)
    const usdBonderFee = bonderFee18d
    const oneEth = parseUnits('1', ethDecimals)
    const usdGasCost = gasCost.mul(chainNativeTokenUsdPriceBn).div(oneEth)
    const usdBonderFeeFormatted = formatUnits(usdBonderFee, ethDecimals)
    const usdGasCostFormatted = formatUnits(usdGasCost, ethDecimals)
    const usdMinTxCost = usdGasCost.div(2)
    const isTooLow = bonderFee.lte(0) || usdBonderFee.lt(usdMinTxCost)

    const minTxFee = parseUnits(Number(formatUnits((usdMinTxCost).mul(tokenUsdPriceBn).div(oneEth), ethDecimals)).toFixed(tokenDecimals), tokenDecimals)

    return {
      isTooLow,
      minTxFee,
      gasCost,
      usdGasCost,
      usdGasCostFormatted,
      usdBonderFee,
      usdBonderFeeFormatted,
      gasPrice,
      gasLimit,
      tokenUsdPrice,
      chainNativeTokenUsdPrice
    }
  }

  async compareMinBonderFeeBasisPoints (
    amountIn: BigNumber,
    bonderFee: BigNumber,
    destinationChain: string,
    tokenSymbol: string
  ) {
    if (amountIn.lte(0)) {
      return BigNumber.from(0)
    }
    // There is no concept of a minBonderFeeAbsolute on the L1 bridge so we default to 0 since the
    // relative fee will negate this value anyway
    let bonderFeeBps = BonderFeeBps.L2ToL1
    if (destinationChain !== Chain.Ethereum) {
      bonderFeeBps = BonderFeeBps.L2ToL2
    }

    const tokenPrice = await priceFeed.getPriceByTokenSymbol(tokenSymbol)
    const tokenDecimals = getTokenDecimals(tokenSymbol)
    const minBonderFeeAbsolute = parseUnits(
      (1 / tokenPrice).toFixed(tokenDecimals),
      tokenDecimals
    )
    let minBonderFeeRelative = amountIn.mul(bonderFeeBps).div(10000)

    // add 10% buffer for in the case amountIn is greater than originally
    // estimated in frontend due to user receiving more hTokens during swap
    const tolerance = 0.10
    minBonderFeeRelative = minBonderFeeRelative.sub(minBonderFeeRelative.mul(tolerance * 100).div(100))
    const minBonderFee = minBonderFeeRelative.gt(minBonderFeeAbsolute)
      ? minBonderFeeRelative
      : MinBonderFeeAbsolute
    const isTooLow = bonderFee.lt(minBonderFee)
    if (isTooLow) {
      throw new BonderFeeTooLowError(`bonder fee is too low. Cannot bond withdrawal. bonderFee: ${bonderFee}, minBonderFee: ${minBonderFee}`)
    }

    return minBonderFee
  }

  async checkMinBonderFee (
    amountIn: BigNumber,
    bonderFee: BigNumber,
    gasLimit: BigNumber,
    chainSlug: string,
    tokenSymbol: string,
    gasPrice?: BigNumber,
    tokenUsdPrice?: number,
    chainNativeTokenUsdPrice?: number,
    gasCost?: BigNumber
  ) {
    const minBpsFee = await this.compareMinBonderFeeBasisPoints(amountIn, bonderFee, chainSlug, tokenSymbol)
    let { isTooLow, minTxFee, usdBonderFeeFormatted, usdGasCostFormatted } = await this.compareBonderDestinationFeeCost(bonderFee, gasLimit, chainSlug, tokenSymbol, gasPrice, tokenUsdPrice, chainNativeTokenUsdPrice, gasCost)
    if (isTooLow) {
      throw new BonderFeeTooLowError(`bonder fee is too low. Cannot bond withdrawal. bonderFee: ${usdBonderFeeFormatted}, gasCost: ${usdGasCostFormatted}`)
    }

    const minBonderFeeTotal = minBpsFee.add(minTxFee)
    isTooLow = bonderFee.lt(minBonderFeeTotal)
    if (isTooLow) {
      throw new BonderFeeTooLowError(`total bonder fee is too low. Cannot bond withdrawal. bonderFee: ${bonderFee}, minBonderFeeTotal: ${minBonderFeeTotal}`)
    }
  }

  getChainNativeTokenSymbol (chain: string) {
    if (chain === Chain.Polygon) {
      return 'MATIC'
    } else if (chain === Chain.xDai) {
      return 'DAI'
    }

    return 'ETH'
  }

  getConfigBonderAddress ():string {
    return globalConfig?.bonders?.[this.tokenSymbol]?.[0]
  }
}
