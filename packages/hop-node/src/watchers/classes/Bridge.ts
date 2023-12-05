import ContractBase from './ContractBase'
import Logger from 'src/logger'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import getTokenMetadataByAddress from 'src/utils/getTokenMetadataByAddress'
import getTransferRootId from 'src/utils/getTransferRootId'
import { BigNumber, Contract, providers } from 'ethers'
import {
  Chain,
  GasCostTransactionType,
  SettlementGasLimitPerTx
} from 'src/constants'
import {
  CoingeckoApiKey,
  getBridgeWriteContractAddress,
  getNetworkCustomSyncType,
  config as globalConfig
} from 'src/config'
import { DbSet, getDbSet } from 'src/db'
import { Event } from 'src/types'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L1_ERC20_Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/generated/L1_ERC20_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { MultipleWithdrawalsSettledEvent, TransferRootSetEvent, WithdrawalBondSettledEvent, WithdrawalBondedEvent, WithdrewEvent } from '@hop-protocol/core/contracts/generated/Bridge'
import { PriceFeed } from '@hop-protocol/sdk'
import { State } from 'src/db/SyncStateDb'
import { estimateL1GasCost } from '@eth-optimism/sdk'
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'

export type EventsBatchOptions = {
  syncCacheKey: string
  startBlockNumber: number
  endBlockNumber: number
}

export type CanonicalTokenConvertOptions = {
  shouldSkipNearestCheck?: boolean
}

export type GasCostEstimationRes = {
  gasCost: BigNumber
  gasCostInToken: BigNumber
  gasLimit: BigNumber
  tokenPriceUsd: number
  nativeTokenPriceUsd: number
}

type BlockValues = {
  end: number
  start: number
  batchBlocks?: number
  earliestBlockInBatch: number
  latestBlockInBatch: number
}

export type DecodedSettleBondedWithdrawalsDataRes = {
  bonder: string
  transferIds: string[]
  totalAmount: BigNumber
}

export type EventCb<E extends Event, R> = (event: E, i?: number) => R
type BridgeContract = L1BridgeContract | L1ERC20BridgeContract | L2BridgeContract

const priceFeed = new PriceFeed({
  coingecko: CoingeckoApiKey ?? undefined
})

export default class Bridge extends ContractBase {
  db: DbSet
  WithdrawalBonded: string = 'WithdrawalBonded'
  Withdrew: string = 'Withdrew'
  TransferRootSet: string = 'TransferRootSet'
  MultipleWithdrawalsSettled: string = 'MultipleWithdrawalsSettled'
  WithdrawalBondSettled: string = 'WithdrawalBondSettled'
  tokenDecimals: number = 18
  tokenSymbol: string = ''
  bridgeContract: BridgeContract
  bridgeDeployedBlockNumber: number
  l1CanonicalTokenAddress: string
  logger: Logger
  bridgeWriteContract: BridgeContract

  constructor (bridgeContract: BridgeContract) {
    super(bridgeContract)
    this.bridgeContract = bridgeContract
    const metadata = getTokenMetadataByAddress(bridgeContract.address, this.chainSlug)
    const tokenDecimals: number = metadata?.decimals
    const tokenSymbol: string = metadata?.symbol

    if (tokenDecimals !== undefined) {
      this.tokenDecimals = tokenDecimals
    }
    if (!tokenSymbol) {
      throw new Error(`expected tokenSymbol in Bridge constructor for chain "${this.chainSlug}" and bridge address "${bridgeContract.address}". Check config or try updating core package.`)
    }
    this.tokenSymbol = tokenSymbol
    this.db = getDbSet(this.tokenSymbol)
    const bridgeDeployedBlockNumber = globalConfig.addresses[this.tokenSymbol]?.[this.chainSlug]?.bridgeDeployedBlockNumber
    const l1CanonicalTokenAddress = globalConfig.addresses[this.tokenSymbol]?.[Chain.Ethereum]?.l1CanonicalToken
    if (!bridgeDeployedBlockNumber) {
      throw new Error('bridge deployed block number is required')
    }
    if (!l1CanonicalTokenAddress) {
      throw new Error('L1 token address is required')
    }
    this.bridgeDeployedBlockNumber = bridgeDeployedBlockNumber
    this.l1CanonicalTokenAddress = l1CanonicalTokenAddress

    const bridgeWriteAddress = getBridgeWriteContractAddress(this.tokenSymbol, this.chainSlug)
    this.bridgeWriteContract = this.bridgeContract.attach(bridgeWriteAddress)

    this.logger = new Logger({
      tag: 'Bridge',
      prefix: `${this.chainSlug}.${this.tokenSymbol}`
    })
  }

  async getBonderAddress (): Promise<string> {
    const address = await (this.bridgeContract as Contract).signer.getAddress()
    if (!address) {
      throw new Error('expected signer address')
    }
    return address
  }

  isBonder = async (): Promise<boolean> => {
    const bonder = await this.getBonderAddress()
    return await this.bridgeContract.getIsBonder(bonder)
  }

  getCredit = async (bonder?: string): Promise<BigNumber> => {
    if (!bonder) {
      bonder = await this.getBonderAddress()
    }
    const credit = await this.bridgeContract.getCredit(bonder)
    return credit
  }

  getDebit = async (bonder?: string): Promise<BigNumber> => {
    if (!bonder) {
      bonder = await this.getBonderAddress()
    }
    const debit = await this.bridgeContract.getDebitAndAdditionalDebit(
      bonder
    )
    return debit
  }

  getRawDebit = async (): Promise<BigNumber> => {
    const bonder = await this.getBonderAddress()
    const debit = await this.bridgeContract.getRawDebit(bonder)
    return debit
  }

  async getBaseAvailableCredit (bonder?: string): Promise<BigNumber> {
    const [credit, debit] = await Promise.all([
      this.getCredit(bonder),
      this.getDebit(bonder)
    ])
    return credit.sub(debit)
  }

  getAddress (): string {
    return this.bridgeContract.address
  }

  async getBondedWithdrawalAmount (transferId: string): Promise<BigNumber> {
    const bonderAddress = await this.getBonderAddress()
    return await this.getBondedWithdrawalAmountByBonder(bonderAddress, transferId)
  }

  getBondedWithdrawalAmountByBonder = async (
    bonder: string,
    transferId: string
  ): Promise<BigNumber> => {
    const bondedBn = await this.bridgeContract.getBondedWithdrawalAmount(
      bonder,
      transferId
    )
    return bondedBn
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
    return await this.getEventTimestamp(event)
  }

  async getBondedWithdrawalEvent (
    transferId: string,
    startBlockNumber?: number,
    endBlockNumber?: number
  ): Promise<WithdrawalBondedEvent | undefined> {
    let match: WithdrawalBondedEvent | undefined
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
  ): Promise<WithdrewEvent | undefined> {
    let match: WithdrewEvent | undefined
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

  isTransferIdSpent = async (transferId: string): Promise<boolean> => {
    return await this.bridgeContract.isTransferIdSpent(transferId)
  }

  getWithdrawalBondedEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBonded(),
      startBlockNumber,
      endBlockNumber
    )
  }

  getWithdrewEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.bridgeContract.queryFilter(
      this.bridgeContract.filters.Withdrew(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapWithdrawalBondedEvents<R> (
    cb: EventCb<WithdrawalBondedEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(this.getWithdrawalBondedEvents, cb, options)
  }

  async mapWithdrewEvents<R> (
    cb: EventCb<WithdrewEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(this.getWithdrewEvents, cb, options)
  }

  getTransferRootSetEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootSet(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapTransferRootSetEvents<R> (
    cb: EventCb<TransferRootSetEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(this.getTransferRootSetEvents, cb, options)
  }

  getParamsFromMultipleSettleEventTransaction = async (
    multipleWithdrawalsSettledTxHash: string
  ): Promise<DecodedSettleBondedWithdrawalsDataRes> => {
    const tx = await this.getTransaction(multipleWithdrawalsSettledTxHash)
    if (!tx) {
      throw new Error('expected tx object')
    }
    return this.decodeSettleBondedWithdrawalsData(tx.data)
  }

  getParamsFromSettleEventTransaction = async (withdrawalSettledTxHash: string) => {
    const tx = await this.getTransaction(withdrawalSettledTxHash)
    if (!tx) {
      throw new Error('expected tx object')
    }
    return this.decodeSettleBondedWithdrawalData(tx.data)
  }

  getMultipleWithdrawalsSettledEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.bridgeContract.queryFilter(
      this.bridgeContract.filters.MultipleWithdrawalsSettled(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async mapMultipleWithdrawalsSettledEvents<R> (
    cb: EventCb<MultipleWithdrawalsSettledEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(
      this.getMultipleWithdrawalsSettledEvents,
      cb,
      options
    )
  }

  async mapWithdrawalBondSettledEvents<R> (
    cb: EventCb<WithdrawalBondSettledEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(
      this.getWithdrawalBondSettledEvents,
      cb,
      options
    )
  }

  getWithdrawalBondSettledEvents = async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBondSettled(),
      startBlockNumber,
      endBlockNumber
    )
  }

  decodeSettleBondedWithdrawalsData (data: string): DecodedSettleBondedWithdrawalsDataRes {
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

  decodeSettleBondedWithdrawalData (data: string): any {
    if (!data) {
      throw new Error('data to decode is required')
    }
    const decoded = this.bridgeContract.interface.decodeFunctionData(
      'settleBondedWithdrawal',
      data
    )
    const {
      bonder,
      transferId,
      rootHash,
      transferRootTotalAmount,
      transferIdTreeIndex,
      siblings,
      totalLeaves
    } = decoded

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

  getTransferRootId = (
    transferRootHash: string,
    totalAmount: BigNumber
  ): string => {
    return getTransferRootId(
      transferRootHash,
      totalAmount
    )
  }

  getTransferRoot = async (
    transferRootHash: string,
    totalAmount: BigNumber
  ) => {
    return await this.bridgeContract.getTransferRoot(
      transferRootHash,
      totalAmount
    )
  }

  // get the chain ids of all bridged L2s and L1
  async getChainIds (): Promise<number[]> {
    const chainIds: number[] = []
    for (const key in globalConfig.networks) {
      const { chainId } = globalConfig.networks[key]
      chainIds.push(chainId)
    }
    return chainIds
  }

  stake = async (amount: BigNumber): Promise<providers.TransactionResponse> => {
    const bonder = await this.getBonderAddress()
    const txOverrides = await this.txOverrides()
    if (
      this.chainSlug === Chain.Ethereum &&
      this.tokenSymbol === 'ETH'
    ) {
      txOverrides.value = amount
    }

    const tx = await this.bridgeWriteContract.stake(
      bonder,
      amount,
      txOverrides
    )

    return tx
  }

  unstake = async (amount: BigNumber): Promise<providers.TransactionResponse> => {
    const tx = await this.bridgeWriteContract.unstake(
      amount,
      await this.txOverrides()
    )
    return tx
  }

  bondWithdrawal = async (
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const txOverrides = await this.txOverrides()

    // Define a max gasLimit in order to avoid gas siphoning
    let gasLimit = 500_000
    if (this.chainSlug === Chain.Arbitrum) {
      gasLimit = 10_000_000
    }
    if (this.chainSlug === Chain.Nova) {
      gasLimit = 5_000_000
    }
    txOverrides.gasLimit = gasLimit

    const payload = [
      recipient,
      amount,
      transferNonce,
      bonderFee,
      txOverrides
    ] as const

    const tx = await this.bridgeWriteContract.bondWithdrawal(...payload)
    return tx
  }

  settleBondedWithdrawals = async (
    bonder: string,
    transferIds: string[],
    amount: BigNumber
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.bridgeWriteContract.settleBondedWithdrawals(
      bonder,
      transferIds,
      amount,
      await this.txOverrides()
    )

    return tx
  }

  withdraw = async (
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber,
    amountOutMin: BigNumber,
    deadline: BigNumber,
    rootHash: string,
    transferRootTotalAmount: BigNumber,
    transferIdTreeIndex: number,
    siblings: string[],
    totalLeaves: number
  ): Promise<providers.TransactionResponse> => {
    const tx = await this.bridgeWriteContract.withdraw(
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      rootHash,
      transferRootTotalAmount,
      transferIdTreeIndex,
      siblings,
      totalLeaves,
      await this.txOverrides()
    )

    return tx
  }

  async getEthBalance (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    if (!bonder) {
      throw new Error('expected bonder address')
    }
    return await this.getBalance(bonder)
  }

  formatUnits (value: BigNumber) {
    if (!value) {
      return 0
    }
    return Number(formatUnits(value?.toString() ?? '', this.tokenDecimals))
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

  protected async mapEventsBatch<E extends Event, R> (
    getEventsMethod: (start: number, end: number) => Promise<E[]>,
    cb: EventCb<E, R>,
    options?: Partial<EventsBatchOptions>
  ): Promise<R[]> {
    let i = 0
    const promises: R[] = []
    // This will grow unbounded in memory and cause OOM issues if the sync range is too large
    await this.eventsBatch(async (start: number, end: number) => {
      let events = await getEventsMethod(start, end)
      events = events.reverse()
      for (const event of events) {
        promises.push(cb(event, i))
      }
      i++
    }, options)
    return await Promise.all(promises)
  }

  public async eventsBatch (
    cb: (start?: number, end?: number, i?: number) => Promise<boolean | undefined> | Promise<void>,
    options: Partial<EventsBatchOptions> = {}
  ) {
    this.validateEventsBatchInput(options)

    // A syncCacheKey should only be defined when syncing, not when calling this function outside of a sync
    let syncCacheKey = ''
    let state: State | null = null
    if (options.syncCacheKey) {
      syncCacheKey = this.getSyncCacheKeyFromKey(
        this.chainId,
        this.address,
        options.syncCacheKey
      )
      state = await this.db.syncState.getByKey(syncCacheKey)
      if (state) {
        const customSyncKeySuffix = this.getCustomSyncKeySuffix()
        if (customSyncKeySuffix && syncCacheKey.endsWith(customSyncKeySuffix)) {
          // If a head sync does not have state or the state is stale, use the state of
          // its finalized counterpart. The finalized counterpart is guaranteed to have updated
          // state since the bonder performs a full sync before beginning any other operations.
          // * The head sync will not have state upon fresh bonder sync.
          // * The head sync will have stale data if they use the head syncer, turn it off
          //   for some time, and then turn it back on again.
          const finalizedStateKey = syncCacheKey.replace(customSyncKeySuffix, '')
          const finalizedState = await this.db.syncState.getByKey(finalizedStateKey)
          if (!finalizedState) {
            throw new Error(`expected finalizedState for key ${finalizedStateKey}`)
          }

          const doesCustomSyncDbExist = !!state.latestBlockSynced
          const isCustomSyncDataStale = state.latestBlockSynced < finalizedState.latestBlockSynced
          if (!doesCustomSyncDbExist || isCustomSyncDataStale) {
            state = finalizedState
          }
        }
      }
    }

    const blockValues: BlockValues = await this.getBlockValues(options, state)
    const {
      start,
      end,
      earliestBlockInBatch,
      latestBlockInBatch
    } = blockValues

    this.logger.debug(`eventsBatch syncCacheKey: ${syncCacheKey} getBlockValues: ${JSON.stringify(blockValues)}`)

    // If the syncer is already at the head, do not fall into the while loop since that uses
    // an unnecessary getLogs call
    const isAtHead = (
      start === end &&
      start === earliestBlockInBatch &&
      start === latestBlockInBatch
    )

    let traversalStart = start
    if (!isAtHead) {
      traversalStart = await this.traverseBlockRange(cb, blockValues)
    }

    // Only store latest block if a sync is successful. Sync is complete when the start block is reached since
    // it traverses backwards from head.
    // NOTE: The syncCacheKey here enforces that the syncState is only updated during a sync and not when this
    // is called for other purposes, such as looking onchain for transferIds in a root.
    if (syncCacheKey && traversalStart === earliestBlockInBatch) {
      this.logger.debug(`eventsBatch syncCacheKey: ${syncCacheKey} syncState latestBlockInBatch: ${latestBlockInBatch}`)
      await this.db.syncState.update(syncCacheKey, {
        latestBlockSynced: latestBlockInBatch,
        timestamp: Date.now()
      })
    }
  }

  private readonly traverseBlockRange = async (
    cb: (start?: number, end?: number, i?: number) => Promise<boolean | undefined> | Promise<void>,
    blockValues: BlockValues
  ): Promise<number> => {
    let { start, end, batchBlocks, earliestBlockInBatch } = blockValues

    let i = 0
    while (start >= earliestBlockInBatch) {
      const shouldContinue = await cb(start, end, i)
      if (
        (typeof shouldContinue === 'boolean' && !shouldContinue) ||
        start === earliestBlockInBatch
      ) {
        break
      }

      // Subtract 1 so that the boundary blocks are not double counted
      end = start - 1
      start = end - batchBlocks!

      if (start < earliestBlockInBatch) {
        start = earliestBlockInBatch
      }
      i++
    }

    return start
  }

  private readonly getBlockValues = async (options: Partial<EventsBatchOptions>, state: State | null): Promise<BlockValues> => {
    const { startBlockNumber, endBlockNumber, syncCacheKey } = options

    let end: number
    let start: number
    let totalBlocksInBatch: number
    const { totalBlocks, batchBlocks } = globalConfig.sync[this.chainSlug]

    // TODO: Better state handling
    const customSyncKeySuffix = this.getCustomSyncKeySuffix()
    const isCustomSync = customSyncKeySuffix && syncCacheKey?.endsWith(customSyncKeySuffix)
    const isInitialSync = !state?.latestBlockSynced && startBlockNumber && !endBlockNumber && !isCustomSync
    const isSync = state?.latestBlockSynced && startBlockNumber && !endBlockNumber && !isCustomSync

    let syncBlockNumber: number
    if (isCustomSync) {
      syncBlockNumber = await this.getSyncBlockNumber()
    } else {
      syncBlockNumber = await this.getSafeBlockNumber()
    }

    if (startBlockNumber && endBlockNumber) {
      end = endBlockNumber
      totalBlocksInBatch = end - startBlockNumber
    } else if (endBlockNumber) {
      end = endBlockNumber
      totalBlocksInBatch = totalBlocks!
    } else if (isInitialSync) {
      end = syncBlockNumber
      totalBlocksInBatch = end - (startBlockNumber ?? 0)
    } else if (isSync || isCustomSync) { // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
      end = Math.max(syncBlockNumber, state?.latestBlockSynced ?? 0)
      totalBlocksInBatch = end - (state?.latestBlockSynced ?? 0)
    } else {
      end = syncBlockNumber
      totalBlocksInBatch = totalBlocks!
    }

    // Handle the case where the chain has less blocks than the total block config
    // This may happen during an Optimism regensis, for example
    if (end - totalBlocksInBatch < 0) {
      totalBlocksInBatch = end
    }

    if (totalBlocksInBatch <= batchBlocks!) {
      start = end - totalBlocksInBatch
    } else {
      start = end - batchBlocks!
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

  public getSyncCacheKeyFromKey = (
    chainId: number,
    address: string,
    key: string
  ) => {
    return `${chainId}:${address}:${key}`
  }

  public getCustomSyncKeySuffix = (): string | undefined => {
    const customSyncType = getNetworkCustomSyncType(this.chainSlug)
    if (!customSyncType) {
      return
    }
    return '_' + customSyncType
  }

  public shouldPerformCustomSync = (): boolean => {
    return !!getNetworkCustomSyncType(this.chainSlug)
  }

  shouldAttemptSwapDuringBondWithdrawal (amountOutMin: BigNumber, deadline: BigNumber): boolean {
    // Do not check if the asset uses an AMM. This function only cares about the amountOutMin and deadline
    // so that it knows what function to call on-chain. This function is unconcerned with wether or not
    // an asset uses an AMM, since a non-AMM asset can still provide amountOutMin and deadline values.
    return amountOutMin?.gt(0) || deadline?.gt(0)
  }

  private readonly validateEventsBatchInput = (
    options: Partial<EventsBatchOptions> = {}
  ) => {
    const { syncCacheKey, startBlockNumber, endBlockNumber } = options

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

      if (syncCacheKey) {
        throw new Error(
          'A key cannot exist when a start and end block are explicitly defined'
        )
      }
    }
  }

  async getMinBonderFeeAbsolute (tokenSymbol: string, tokenPriceUsd: number) {
    // There is no concept of a minBonderFeeAbsolute on the L1 bridge so we default to 0 since the
    // relative fee will negate this value anyway
    const destinationChain = this.chainSlug
    if (destinationChain === Chain.Ethereum) {
      return BigNumber.from(0)
    }

    let minBonderFeeUsd = 0.25
    if (destinationChain === Chain.Optimism || destinationChain === Chain.Base) {
      minBonderFeeUsd = 0.10
    }
    const tokenDecimals = getTokenDecimals(tokenSymbol)
    let minBonderFeeAbsolute = parseUnits(
      (minBonderFeeUsd / tokenPriceUsd).toFixed(tokenDecimals),
      tokenDecimals
    )

    // add 10% buffer for in the case that the token price materially
    // changes after the transaction send but before bond
    const tolerance = 0.10
    minBonderFeeAbsolute = minBonderFeeAbsolute.sub(minBonderFeeAbsolute.mul(tolerance * 100).div(100))

    return minBonderFeeAbsolute
  }

  async getBonderFeeBps (
    destinationChain: Chain,
    amountIn: BigNumber,
    minBonderFeeAbsolute: BigNumber
  ) {
    if (amountIn.lte(0)) {
      return BigNumber.from(0)
    }
    const fees = globalConfig?.fees?.[this.tokenSymbol]
    if (!fees) {
      throw new Error(`fee config not found for ${this.tokenSymbol}`)
    }

    const bonderFeeBps = fees[destinationChain]
    if (!bonderFeeBps) {
      throw new Error(`fee config not found for chain ${destinationChain}`)
    }
    const minBonderFeeRelative = amountIn.mul(bonderFeeBps).div(10000)
    let minBonderFee = minBonderFeeRelative.gt(minBonderFeeAbsolute)
      ? minBonderFeeRelative
      : minBonderFeeAbsolute

    // add 10% buffer for in the case amountIn is greater than originally
    // estimated in frontend due to user receiving more hTokens during swap
    const tolerance = 0.10
    minBonderFee = minBonderFee.sub(minBonderFee.mul(tolerance * 100).div(100))
    return minBonderFee
  }

  async getGasCostEstimation (
    chain: string,
    tokenSymbol: string,
    gasPrice: BigNumber,
    gasLimit: BigNumber,
    transactionType: GasCostTransactionType,
    data?: string,
    to?: string
  ): Promise<GasCostEstimationRes> {
    const chainNativeTokenSymbol = this.getChainNativeTokenSymbol(chain)
    let gasCost: BigNumber = BigNumber.from('0')
    if (transactionType === GasCostTransactionType.Relay) {
      // Relay transactions use the gasLimit as the gasCost
      gasCost = gasLimit
    } else {
      // Include the cost to settle an individual transfer
      const settlementGasLimitPerTx: number = SettlementGasLimitPerTx[chain]
      const gasLimitWithSettlement = gasLimit.add(settlementGasLimitPerTx)

      gasCost = gasLimitWithSettlement.mul(gasPrice)
    }

    if (
      (this.chainSlug === Chain.Optimism || this.chainSlug === Chain.Base) &&
      data &&
      to
    ) {
      try {
        const tx = {
          value: parseEther('0'),
          gasPrice,
          gasLimit,
          to,
          data
        }
        const l1FeeInWei = await estimateL1GasCost(getRpcProvider(this.chainSlug)!, tx)
        gasCost = gasCost.add(l1FeeInWei)
      } catch (err) {
        console.error(err)
      }
    }

    const {
      decimals: tokenDecimals,
      priceUsd: tokenPriceUsd,
      priceUsdWei: tokenPriceUsdWei
    } = await this.getGasCostTokenValues(tokenSymbol)
    const {
      decimals: nativeTokenDecimals,
      priceUsd: nativeTokenPriceUsd,
      priceUsdWei: nativeTokenPriceUsdWei
    } = await this.getGasCostTokenValues(chainNativeTokenSymbol)

    const multiplier = parseEther('1')
    const rate = (nativeTokenPriceUsdWei.mul(multiplier)).div(tokenPriceUsdWei)
    const exponent = nativeTokenDecimals - tokenDecimals

    const gasCostInTokenWei = gasCost.mul(rate).div(multiplier)
    const gasCostInToken = gasCostInTokenWei.div(BigNumber.from(10).pow(exponent))

    return {
      gasCost,
      gasCostInToken,
      gasLimit,
      tokenPriceUsd,
      nativeTokenPriceUsd
    }
  }

  async getGasCostTokenValues (symbol: string) {
    const decimals = getTokenDecimals(symbol)
    let priceUsd
    try {
      priceUsd = await priceFeed.getPriceByTokenSymbol(symbol)!
    } catch (err) {
      throw new Error(`failed to get price for ${symbol} with error message: ${err.message}`)
    }
    if (typeof priceUsd !== 'number') {
      throw new Error('expected price to be number type')
    }
    const priceUsdWei = parseEther(priceUsd.toString())
    return {
      decimals,
      priceUsd,
      priceUsdWei
    }
  }

  getChainNativeTokenSymbol (chain: string) {
    if (chain === Chain.Polygon) {
      return 'MATIC'
    } else if (chain === Chain.Gnosis) {
      return 'DAI'
    }

    return 'ETH'
  }

  async isTransferRootSet (transferRootHash: string, totalAmount: BigNumber): Promise<boolean> {
    const transferRootStruct = await this.getTransferRoot(transferRootHash, totalAmount)
    if (!transferRootStruct) {
      throw new Error('transfer root struct not found')
    }
    const createdAt = Number(transferRootStruct.createdAt?.toString())
    return createdAt > 0
  }
}
