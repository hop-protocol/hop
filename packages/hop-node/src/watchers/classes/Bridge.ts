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
import { Bridge as BridgeContract, MultipleWithdrawalsSettledEvent, TransferRootSetEvent, WithdrawalBondedEvent, WithdrewEvent } from '@hop-protocol/core/contracts/Bridge'
import { Db, getDbSet } from 'src/db'
import { Event } from 'src/types'
import { PriceFeed } from 'src/priceFeed'
import { State } from 'src/db/SyncStateDb'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { config as globalConfig } from 'src/config'

export interface EventsBatchOptions {
  cacheKey: string
  startBlockNumber: number
  endBlockNumber: number
}

export type EventCb<E extends Event, R> = (event: E, i?: number) => R

const priceFeed = new PriceFeed()

export default class Bridge extends ContractBase {
  db: Db
  WithdrawalBonded: string = 'WithdrawalBonded'
  Withdrew: string = 'Withdrew'
  TransferRootSet: string = 'TransferRootSet'
  MultipleWithdrawalsSettled: string = 'MultipleWithdrawalsSettled'
  tokenDecimals: number = 18
  tokenSymbol: string = ''
  bridgeContract: BridgeContract
  bridgeDeployedBlockNumber: number
  l1CanonicalTokenAddress: string
  stateUpdateAddress: string

  constructor (bridgeContract: BridgeContract) {
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
    const bridgeDeployedBlockNumber = globalConfig.tokens?.[this.tokenSymbol]?.[this.chainSlug]?.bridgeDeployedBlockNumber
    const l1CanonicalTokenAddress = globalConfig.tokens?.[this.tokenSymbol]?.[Chain.Ethereum]?.l1CanonicalToken
    if (!bridgeDeployedBlockNumber) {
      throw new Error('bridge deployed block number is required')
    }
    if (!l1CanonicalTokenAddress) {
      throw new Error('L1 token address is required')
    }
    this.bridgeDeployedBlockNumber = bridgeDeployedBlockNumber
    this.l1CanonicalTokenAddress = l1CanonicalTokenAddress
    this.stateUpdateAddress = globalConfig?.stateUpdateAddress! // eslint-disable-line
  }

  async getBonderAddress (): Promise<string> {
    return await (this.bridgeContract as Contract).signer.getAddress()
  }

  isBonder = rateLimitRetry(async (): Promise<boolean> => {
    const bonder = await this.getBonderAddress()
    return await this.bridgeContract.getIsBonder(bonder)
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
    return await this.getBondedWithdrawalAmountByBonder(bonderAddress, transferId)
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

  isTransferIdSpent = rateLimitRetry(async (transferId: string): Promise<boolean> => {
    return await this.bridgeContract.isTransferIdSpent(transferId)
  })

  getWithdrawalBondedEvents = rateLimitRetry(async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBonded(),
      startBlockNumber,
      endBlockNumber
    )
  })

  getWithdrewEvents = rateLimitRetry(async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.bridgeContract.queryFilter(
      this.bridgeContract.filters.Withdrew(),
      startBlockNumber,
      endBlockNumber
    )
  })

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

  getTransferRootSetEvents = rateLimitRetry(async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootSet(),
      startBlockNumber,
      endBlockNumber
    )
  })

  async getTransferRootSetTxHash (
    transferRootHash: string
  ): Promise<string | undefined> {
    let txHash: string | undefined
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

  async mapTransferRootSetEvents<R> (
    cb: EventCb<TransferRootSetEvent, R>,
    options?: Partial<EventsBatchOptions>
  ) {
    return await this.mapEventsBatch(this.getTransferRootSetEvents, cb, options)
  }

  getWithdrawalBondSettledEvents = rateLimitRetry(async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.bridgeContract.queryFilter(
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

  getMultipleWithdrawalsSettledEvents = rateLimitRetry(async (
    startBlockNumber: number,
    endBlockNumber: number
  ) => {
    return await this.bridgeContract.queryFilter(
      this.bridgeContract.filters.MultipleWithdrawalsSettled(),
      startBlockNumber,
      endBlockNumber
    )
  })

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

  getTransferRoot = rateLimitRetry(async (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<any> => {
    return await this.bridgeContract.getTransferRoot(
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

  async getL1ChainId (): Promise<number | undefined> {
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
    chainNativeTokenUsdPrice?: number
  ): Promise<providers.TransactionResponse> => {
    const txOverrides = await this.txOverrides()
    const payload = [
      recipient,
      amount,
      transferNonce,
      bonderFee,
      txOverrides
    ] as const

    const gasLimit = await this.bridgeContract.estimateGas.bondWithdrawal(...payload)
    await checkMinBonderFee(amount, bonderFee, gasLimit, this.chainSlug, this.tokenSymbol, gasPrice, tokenUsdPrice, chainNativeTokenUsdPrice)

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
    return await this.getBalance(bonder)
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

  protected async mapEventsBatch<E extends Event, R> (
    getEventsMethod: (start: number, end: number) => Promise<E[]>,
    cb: EventCb<E, R>,
    options?: Partial<EventsBatchOptions>
  ): Promise<R[]> {
    let i = 0
    const results: R[] = []
    await this.eventsBatch(async (start: number, end: number) => {
      let events = await rateLimitRetry(getEventsMethod)(start, end /*, i */)
      events = events.reverse()
      for (const event of events) {
        results.push(await cb(event, i++))
      }
    }, options)
    return results
  }

  public async eventsBatch (
    cb: (start?: number, end?: number, i?: number) => Promise<boolean | undefined> | Promise<void>,
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
    } = await this.getBlockValues(options, state!) // eslint-disable-line

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
      start = end - batchBlocks! // eslint-disable-line

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

  private readonly getBlockValues = async (options: Partial<EventsBatchOptions>, state: State) => {
    const { startBlockNumber, endBlockNumber } = options

    let end: number
    let start: number
    let totalBlocksInBatch: number
    const { totalBlocks, batchBlocks } = globalConfig.sync?.[this.chainSlug] ?? {}
    const currentBlockNumber = await this.getBlockNumber()
    const currentBlockNumberWithFinality = currentBlockNumber - this.waitConfirmations
    const isInitialSync = !state?.latestBlockSynced && startBlockNumber && !endBlockNumber
    const isSync = state?.latestBlockSynced && startBlockNumber && !endBlockNumber

    if (startBlockNumber && endBlockNumber) {
      end = endBlockNumber
      totalBlocksInBatch = end - startBlockNumber
    } else if (endBlockNumber) {
      end = endBlockNumber
      totalBlocksInBatch = totalBlocks! // eslint-disable-line
    } else if (isInitialSync) {
      end = currentBlockNumberWithFinality
      totalBlocksInBatch = end - startBlockNumber
    } else if (isSync) {
      end = Math.max(currentBlockNumberWithFinality, state.latestBlockSynced)
      totalBlocksInBatch = end - state.latestBlockSynced
    } else {
      end = currentBlockNumberWithFinality
      totalBlocksInBatch = totalBlocks! // eslint-disable-line
    }

    // Handle the case where the chain has less blocks than the total block config
    // This may happen during an Optimism regensis, for example
    if (end - totalBlocksInBatch < 0) {
      totalBlocksInBatch = end
    }

    if (totalBlocksInBatch <= batchBlocks!) { // eslint-disable-line
      start = end - totalBlocksInBatch
    } else {
      start = end - batchBlocks! // eslint-disable-line
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

  private readonly validateEventsBatchInput = (
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

  getChainNativeTokenSymbol (chain: string) {
    return getChainNativeTokenSymbol(chain)
  }
}

export async function compareBonderDestinationFeeCost (
  bonderFee: BigNumber,
  gasLimit: BigNumber,
  chain: string,
  tokenSymbol: string,
  gasPrice?: BigNumber,
  tokenUsdPrice?: number,
  chainNativeTokenUsdPrice?: number
) {
  const ethDecimals = 18
  const provider = getRpcProvider(chain)
  if (gasPrice == null) {
    gasPrice = getBumpedGasPrice(await provider!.getGasPrice(), MaxGasPriceMultiplier) // eslint-disable-line
  }
  if (!tokenUsdPrice) {
    tokenUsdPrice = (await priceFeed.getPriceByTokenSymbol(tokenSymbol))! // eslint-disable-line
  }
  const gasCost = gasLimit.mul(gasPrice)
  const chainNativeTokenSymbol = getChainNativeTokenSymbol(chain)
  if (!chainNativeTokenUsdPrice) {
    chainNativeTokenUsdPrice = (await priceFeed.getPriceByTokenSymbol(chainNativeTokenSymbol))! // eslint-disable-line
  }
  const tokenUsdPriceBn = parseUnits(tokenUsdPrice!.toString(), ethDecimals) // eslint-disable-line
  const chainNativeTokenUsdPriceBn = parseUnits(chainNativeTokenUsdPrice!.toString(), ethDecimals) // eslint-disable-line
  const tokenDecimals = getTokenDecimals(tokenSymbol)
  const bonderFee18d = shiftBNDecimals(bonderFee, ethDecimals - tokenDecimals)
  const oneEth = parseUnits('1', ethDecimals)
  const usdBonderFee = bonderFee18d.mul(tokenUsdPriceBn).div(oneEth)
  const usdGasCost = gasCost.mul(chainNativeTokenUsdPriceBn).div(oneEth)
  const usdBonderFeeFormatted = formatUnits(usdBonderFee, ethDecimals)
  const usdGasCostFormatted = formatUnits(usdGasCost, ethDecimals)
  const usdMinTxCost = usdGasCost.div(2)
  const isTooLow = bonderFee.lte(0) || usdBonderFee.lt(usdMinTxCost)
  if (isTooLow) {
    throw new BonderFeeTooLowError(`bonder fee is too low. Cannot bond withdrawal. bonderFee: ${usdBonderFeeFormatted}, gasCost: ${usdGasCostFormatted}`)
  }

  return parseUnits(Number(formatUnits((usdMinTxCost).mul(tokenUsdPriceBn).div(oneEth), ethDecimals)).toFixed(tokenDecimals), tokenDecimals)
}

export async function compareMinBonderFeeBasisPoints (
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
    (1 / tokenPrice!).toFixed(tokenDecimals), // eslint-disable-line
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

export async function checkMinBonderFee (
  amountIn: BigNumber,
  bonderFee: BigNumber,
  gasLimit: BigNumber,
  chainSlug: string,
  tokenSymbol: string,
  gasPrice?: BigNumber,
  tokenUsdPrice?: number,
  chainNativeTokenUsdPrice?: number
) {
  await compareMinBonderFeeBasisPoints(amountIn, bonderFee, chainSlug, tokenSymbol)
  await compareBonderDestinationFeeCost(bonderFee, gasLimit, chainSlug, tokenSymbol, gasPrice, tokenUsdPrice, chainNativeTokenUsdPrice)
  // const minBpsFee = await compareMinBonderFeeBasisPoints(amountIn, bonderFee, chainSlug, tokenSymbol)
  // const minTxFee = await compareBonderDestinationFeeCost(bonderFee, gasLimit, chainSlug, tokenSymbol, gasPrice, tokenUsdPrice, chainNativeTokenUsdPrice)

  // const minBonderFeeTotal = minBpsFee.add(minTxFee)
  // const isTooLow = bonderFee.lt(minBonderFeeTotal)
  // if (isTooLow) {
  //   throw new BonderFeeTooLowError(`total bonder fee is too low. Cannot bond withdrawal. bonderFee: ${bonderFee}, minBonderFeeTotal: ${minBonderFeeTotal}`)
  // }
}

function getChainNativeTokenSymbol (chain: string) {
  if (chain === Chain.Polygon) {
    return 'MATIC'
  } else if (chain === Chain.xDai) {
    return 'DAI'
  }

  return 'ETH'
}
