import { providers, Contract, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import ContractBase from './ContractBase'
import queue from 'src/decorators/queue'
import { config } from 'src/config'
import unique from 'src/utils/unique'
import { isL1ChainId, xor } from 'src/utils'
import db from 'src/db'

export default class Bridge extends ContractBase {
  WithdrawalBonded: string = 'WithdrawalBonded'
  TransferRootSet: string = 'TransferRootSet'
  MultipleWithdrawalsSettled: string = 'TransferRootSet'
  tokenDecimals: number = 18
  tokenSymbol: string = ''

  constructor (public bridgeContract: Contract) {
    super(bridgeContract)
    this.bridgeContract = bridgeContract
    let tokenDecimals: number
    let tokenSymbol: string
    // TODO: better way of getting token decimals
    for (let tkn in config.tokens) {
      for (let key in config.tokens[tkn]) {
        for (let net in config.tokens[tkn]) {
          for (let k in config.tokens[tkn][net]) {
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

  bridgeStartListeners (): void {
    this.bridgeContract
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
    return this.bridgeContract.signer.getAddress()
  }

  async isBonder (): Promise<boolean> {
    const bonder = await this.getBonderAddress()
    return this.bridgeContract.getIsBonder(bonder)
  }

  async getCredit (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    const credit = await this.bridgeContract.getCredit(bonder)
    return credit
  }

  async getDebit (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    const debit = await this.bridgeContract.getDebitAndAdditionalDebit(bonder)
    return debit
  }

  async getRawDebit (): Promise<BigNumber> {
    const bonder = await this.getBonderAddress()
    const debit = await this.bridgeContract.getRawDebit(bonder)
    return debit
  }

  async getAvailableCredit (): Promise<BigNumber> {
    const [credit, debit] = await Promise.all([
      this.getCredit(),
      this.getDebit()
    ])
    return credit.sub(debit)
  }

  async hasPositiveBalance (): Promise<boolean> {
    const credit = await this.getAvailableCredit()
    return credit.gt(0)
  }

  getAddress (): string {
    return this.bridgeContract.address
  }

  async getBondedWithdrawalAmount (transferId: string): Promise<BigNumber> {
    const bonderAddress = await this.getBonderAddress()
    return this.getBondedWithdrawalAmountByBonder(bonderAddress, transferId)
  }

  async getBondedWithdrawalAmountByBonder (
    bonder: string,
    transferId: string
  ): Promise<BigNumber> {
    const bondedBn = await this.bridgeContract.getBondedWithdrawalAmount(
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
    for (let bonder of bonders) {
      const bondedAmount = await this.getBondedWithdrawalAmountByBonder(
        bonder,
        transferId
      )
      totalBondedAmount = totalBondedAmount.add(bondedAmount)
    }
    return totalBondedAmount
  }

  async getBonderBondedWithdrawalsBalance (): Promise<BigNumber> {
    const bonderAddress = await this.getBonderAddress()
    const blockNumber = await this.bridgeContract.provider.getBlockNumber()
    let total = BigNumber.from(0)
    await this.eventsBatch(async (start: number, end: number) => {
      const withdrawalBondedEvents = await this.getWithdrawalBondedEvents(
        start,
        end
      )
      for (let event of withdrawalBondedEvents) {
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

  isTransferIdSpent (transferId: string): Promise<boolean> {
    return this.bridgeContract.isTransferIdSpent(transferId)
  }

  async getWithdrawalBondedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBonded(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getTransferRootSetEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.TransferRootSet(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getWithdrawalBondSettledEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBondSettled(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getMultipleWithdrawalsSettledEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ): Promise<any[]> {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.MultipleWithdrawalsSettled(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getTransferRootId (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<string> {
    return this.bridgeContract.getTransferRootId(transferRootHash, totalAmount)
  }

  async getTransferRoot (
    transferRootHash: string,
    totalAmount: BigNumber
  ): Promise<any> {
    return this.bridgeContract.getTransferRoot(transferRootHash, totalAmount)
  }

  // get the chain ids of all bridged L2s and L1
  async getChainIds (): Promise<number[]> {
    let chainIds: number[] = []
    for (let key in config.networks) {
      const { networkId: chainId } = config.networks[key]
      chainIds.push(chainId)
    }
    return chainIds
  }

  async getL1ChainId (): Promise<number> {
    for (let key in config.networks) {
      const { networkId: chainId } = config.networks[key]
      if (isL1ChainId(chainId)) {
        return chainId
      }
    }
  }

  async getL2ChainIds (): Promise<number[]> {
    let chainIds: number[] = []
    for (let key in config.networks) {
      const { networkId: chainId } = config.networks[key]
      if (isL1ChainId(chainId)) {
        continue
      }
      chainIds.push(chainId)
    }
    return chainIds
  }

  @queue
  async stake (amount: BigNumber): Promise<providers.TransactionResponse> {
    const bonder = await this.getBonderAddress()
    const tx = await this.bridgeContract.stake(
      bonder,
      amount,
      await this.txOverrides()
    )
    await tx.wait()
    return tx
  }

  @queue
  async unstake (amount: BigNumber): Promise<providers.TransactionResponse> {
    const bonder = await this.getBonderAddress()
    const tx = await this.bridgeContract.unstake(
      amount,
      await this.txOverrides()
    )
    await tx.wait()
    return tx
  }

  @queue
  async bondWithdrawal (
    recipient: string,
    amount: BigNumber,
    transferNonce: string,
    bonderFee: BigNumber
  ): Promise<providers.TransactionResponse> {
    const tx = await this.bridgeContract.bondWithdrawal(
      recipient,
      amount,
      transferNonce,
      bonderFee,
      await this.txOverrides()
    )

    await tx.wait()
    return tx
  }

  @queue
  async settleBondedWithdrawals (
    bonder: string,
    transferIds: string[],
    amount: BigNumber
  ): Promise<providers.TransactionResponse> {
    const tx = await this.bridgeContract.settleBondedWithdrawals(
      bonder,
      transferIds,
      amount,
      await this.txOverrides()
    )

    await tx.wait()
    return tx
  }

  formatUnits (value: BigNumber) {
    return Number(formatUnits(value.toString(), this.tokenDecimals))
  }

  parseUnits (value: string | number) {
    return parseUnits(value.toString(), this.tokenDecimals)
  }

  public async eventsBatch (
    cb: (start?: number, end?: number, i?: number) => Promise<void | boolean>,
    options: any = {
      key: '',
      startBlockNumber: undefined,
      endBlockNumber: undefined
    }
  ) {
    await this.waitTilReady()
    this.validateEventsBatchInput(options)

    const { key, startBlockNumber, endBlockNumber } = options
    let { totalBlocks, batchBlocks } = config.sync[this.chainSlug]
    const currentBlockNumber = await this.getBlockNumber()
    let end = currentBlockNumber
    let start = end - batchBlocks

    if (startBlockNumber && endBlockNumber) {
      end = endBlockNumber
      start = startBlockNumber
      totalBlocks = end - start
    }

    let cacheKey = ''
    if (key) {
      cacheKey = this.getCacheKeyFromKey(this.chainId, this.address, key)
      const state = await db.syncState.getByKey(cacheKey)

      if (state?.latestBlockSynced) {
        start = state.latestBlockSynced
        totalBlocks = currentBlockNumber - start
      }
    }

    let i = 0
    let latestBlockSynced = end
    if (totalBlocks <= batchBlocks) {
      await cb(start, end, i)
    } else {
      while (start >= currentBlockNumber - totalBlocks) {
        const shouldContinue = await cb(start, end, i)
        if (typeof shouldContinue === 'boolean' && !shouldContinue) {
          break
        }

        latestBlockSynced = end
        end = start
        start = end - batchBlocks
        i++
      }
    }

    if (cacheKey) {
      await db.syncState.update(cacheKey, {
        latestBlockSynced,
        timestamp: Date.now()
      })
    }
  }

  public getCacheKeyFromKey = (chainId: number, address: string, key: string) => {
    return `${chainId}:${address}:${key}`
  }

  private validateEventsBatchInput = (options: any) => {
    const { key, startBlockNumber, endBlockNumber } = options

    const isStartAndEndBlock = startBlockNumber && endBlockNumber
    if (isStartAndEndBlock && startBlockNumber >= endBlockNumber) {
      throw new Error('Cannot pass in a start block that is after an end block')
    }

    if (isStartAndEndBlock && key) {
      throw new Error('A key cannot exist when a start and end block are explicitly defined')
    }

    const doesOnlyStartOrEndExist = xor(startBlockNumber, endBlockNumber)
    if (doesOnlyStartOrEndExist) {
      throw new Error('If either a start or end block number exist, both must exist')
    }
  }
}
