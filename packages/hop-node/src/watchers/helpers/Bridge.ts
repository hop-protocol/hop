import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import ContractBase from './ContractBase'
import queue from './queue'
import * as config from 'src/config'
import unique from 'src/utils/unique'

export default class Bridge extends ContractBase {
  WithdrawalBonded: string = 'WithdrawalBonded'
  tokenDecimals: number

  constructor (public bridgeContract: Contract) {
    super(bridgeContract)
    this.bridgeContract = bridgeContract
    let tokenDecimals = 18
    // TODO: better way of getting token decimals
    for (let tkn in config.config.tokens) {
      for (let key in config.config.tokens[tkn]) {
        for (let net in config.config.tokens[tkn]) {
          for (let k in config.config.tokens[tkn][net]) {
            const val = config.config.tokens[tkn][net][k]
            if (val === bridgeContract.address) {
              tokenDecimals = (config.metadata.tokens as any)[tkn].decimals
              break
            }
          }
        }
      }
    }
    this.tokenDecimals = tokenDecimals
    this.bridgeStartListeners()
  }

  bridgeStartListeners () {
    this.bridgeContract
      .on(this.bridgeContract.filters.WithdrawalBonded(), (...args: any[]) =>
        this.emit(this.WithdrawalBonded, ...args)
      )
      .on('error', err => {
        this.emit('error', err)
      })
  }

  async getBonderAddress () {
    return this.bridgeContract.signer.getAddress()
  }

  async isBonder () {
    const bonder = await this.getBonderAddress()
    return this.bridgeContract.getIsBonder(bonder)
  }

  async getCredit () {
    const bonder = await this.getBonderAddress()
    const credit = (await this.bridgeContract.getCredit(bonder)).toString()
    return Number(formatUnits(credit, this.tokenDecimals))
  }

  async getDebit () {
    const bonder = await this.getBonderAddress()
    const debit = (
      await this.bridgeContract.getDebitAndAdditionalDebit(bonder)
    ).toString()
    return Number(formatUnits(debit, this.tokenDecimals))
  }

  async hasPositiveBalance () {
    const [credit, debit] = await Promise.all([
      this.getCredit(),
      this.getDebit()
    ])
    return credit >= debit && credit > 0
  }

  getAddress () {
    return this.bridgeContract.address
  }

  async getBondedWithdrawalAmount (transferHash: string) {
    const bonderAddress = await this.getBonderAddress()
    return this.getBondedWithdrawalAmountByBonder(bonderAddress, transferHash)
  }

  async getBondedWithdrawalAmountByBonder (
    bonder: string,
    transferHash: string
  ) {
    const bondedBn = await this.bridgeContract.getBondedWithdrawalAmount(
      bonder,
      transferHash
    )
    return Number(formatUnits(bondedBn.toString(), this.tokenDecimals))
  }

  async getTotalBondedWithdrawalAmount (transferHash: string) {
    let totalBondedAmount = 0
    const bonderAddress = await this.getBonderAddress()
    let bonders = [bonderAddress]
    if (Array.isArray(config?.bonders)) {
      bonders = unique([bonderAddress, ...config.bonders])
    }
    for (let bonder of bonders) {
      const bondedAmount = await this.getBondedWithdrawalAmountByBonder(
        bonder,
        transferHash
      )
      totalBondedAmount += bondedAmount
    }
    return totalBondedAmount
  }

  async getBonderBondedWithdrawalsBalance () {
    const bonderAddress = await this.getBonderAddress()
    const blockNumber = await this.bridgeContract.provider.getBlockNumber()
    const startBlockNumber = blockNumber - 1000
    const withdrawalBondedEvents = await this.getWithdrawalBondedEvents(
      startBlockNumber,
      blockNumber
    )
    let total = 0
    for (let event of withdrawalBondedEvents) {
      const { transferId } = event.args
      const amount = await this.getBondedWithdrawalAmountByBonder(
        bonderAddress,
        transferId
      )
      total += amount
    }
    return total
  }

  isTransferHashSpent (transferHash: string) {
    return this.bridgeContract.isTransferIdSpent(transferHash)
  }

  async getWithdrawalBondedEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ) {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBonded(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getWithdrawalBondeSettledEvents (
    startBlockNumber: number,
    endBlockNumber: number
  ) {
    return this.bridgeContract.queryFilter(
      this.bridgeContract.filters.WithdrawalBondSettled(),
      startBlockNumber,
      endBlockNumber
    )
  }

  async getTransferRootId (transferRootHash: string, totalAmount: number) {
    const parsedTotalAmount = parseUnits(
      totalAmount.toString(),
      this.tokenDecimals
    )
    return this.bridgeContract.getTransferRootId(
      transferRootHash,
      parsedTotalAmount
    )
  }

  async getTransferRoot (transferRootHash: string, totalAmount: number) {
    const parsedTotalAmount = parseUnits(
      totalAmount.toString(),
      this.tokenDecimals
    )
    return this.bridgeContract.getTransferRoot(
      transferRootHash,
      parsedTotalAmount
    )
  }

  @queue
  async stake (amount: string) {
    const parsedAmount = parseUnits(amount, this.tokenDecimals)
    const bonder = await this.getBonderAddress()
    const tx = await this.bridgeContract.stake(
      bonder,
      parsedAmount,
      await this.txOverrides()
    )
    await tx.wait()
    return tx
  }

  @queue
  async bondWithdrawal (
    recipient: string,
    amount: string,
    transferNonce: string,
    bonderFee: string
  ) {
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
    transferHashes: string[],
    parsedAmount: string
  ) {
    const tx = await this.bridgeContract.settleBondedWithdrawals(
      bonder,
      transferHashes,
      parsedAmount,
      await this.txOverrides()
    )

    await tx.wait()
    return tx
  }
}
