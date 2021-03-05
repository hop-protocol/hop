import '../moduleAlias'
import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait, networkIdToSlug } from 'src/utils'
import { store } from 'src/store'
import chalk from 'chalk'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  l1BridgeContract: any
  l2BridgeContract: any
  contracts: any
  label: string
  order?: () => number
}

const cache: { [key: string]: boolean } = {}

class SettleBondedWithdrawalWatcher extends BaseWatcher {
  l1BridgeContract: any
  l2BridgeContract: any
  contracts: any
  label: string

  constructor (config: Config) {
    super({
      label: 'settleBondedWithdrawalWatcher',
      logColor: 'magenta',
      order: config.order
    })
    this.l1BridgeContract = config.l1BridgeContract
    this.l2BridgeContract = config.l2BridgeContract
    this.contracts = config.contracts
    this.label = config.label
  }

  async start () {
    this.started = true
    this.logger.log(`starting L1 ${this.label} BondTransferRoot event watcher`)
    try {
      await this.watch()
    } catch (err) {
      this.logger.error(`${this.label} watcher error:`, err)
    }
  }

  async stop () {
    this.l1BridgeContract.off(
      this.l1BridgeContract.filters.TransferRootBonded(),
      this.handleTransferRootBondedEvent
    )
    this.started = false
  }

  sendTx = async (
    chainId: string,
    transferHash: string,
    rootHash: string,
    totalAmount: number,
    proof: string[]
  ) => {
    const cacheKey = `${rootHash}${chainId}`
    if (cache[cacheKey]) {
      throw new Error('cancelled')
    }
    const onchainRoot = await this.l1BridgeContract.getTransferRoot(
      rootHash,
      parseUnits(totalAmount.toString(), 18)
    )
    this.logger.log(`${this.label} onchain rootHash:`, onchainRoot)
    this.logger.log(`${this.label} rootHash:`, rootHash)
    this.logger.log(this.label, 'settleBondedWithdrawal params:')
    this.logger.log(this.label, 'chainId:', chainId)
    this.logger.log(this.label, 'transferHash:', transferHash)
    this.logger.log(this.label, 'rootHash:', rootHash)
    this.logger.log(this.label, 'proof:', proof)
    const bondedAmount = await this.getBondedAmount(transferHash, chainId)
    this.logger.log(this.label, 'bonded amount:', bondedAmount)
    this.logger.log(this.label, 'total amount:', totalAmount)
    this.logger.log(
      `${this.label} l1 settleBondedWithdrawal amount: ${bondedAmount}`
    )
    cache[cacheKey] = true
    return this.settleBondedWithdrawal(
      transferHash,
      rootHash,
      totalAmount,
      proof,
      chainId
    )
  }

  settleBondedWithdrawal = async (
    transferHash: string,
    rootHash: string,
    totalAmount: number,
    proof: any[],
    chainId: string
  ) => {
    const bridge = this.contracts[chainId]
    const bonder = await this.getBonderAddress()
    return bridge.settleBondedWithdrawal(
      bonder,
      transferHash,
      rootHash,
      parseUnits(totalAmount.toString(), 18),
      proof
    )
  }

  getBondedAmount = async (transferHash: string, chainId: string) => {
    const bridge = this.contracts[chainId]
    const bonder = await this.getBonderAddress()
    const bondedBn = await bridge.getBondedWithdrawalAmount(
      bonder,
      transferHash
    )
    const bondedAmount = Number(formatUnits(bondedBn.toString(), 18))
    return bondedAmount
  }

  handleTransferRootBondedEvent = async (
    rootHash: string,
    _totalAmount: string,
    meta: any
  ) => {
    const { transactionHash } = meta
    const totalAmount = Number(formatUnits(_totalAmount, 18))
    this.logger.log(`${this.label} received L1 BondTransferRoot event:`)
    this.logger.log(`${this.label} bondRoot: ${rootHash}`)
    this.logger.log(`${this.label} bondAmount: ${totalAmount}`)
    this.logger.log(`${this.label} event transactionHash: ${transactionHash}`)

    const proof = []
    const transfers: any[] = Object.values(store.transferHashes)
    this.logger.log(`${this.label} transfers:`, transfers.length)
    for (let item of transfers) {
      try {
        const { transferHash, chainId } = item
        const tx = await this.sendTx(
          chainId,
          transferHash,
          rootHash,
          totalAmount,
          proof
        )
        tx?.wait().then(() => {
          this.emit('settleBondedWithdrawal', {
            networkName: networkIdToSlug(chainId),
            networkId: chainId,
            transferHash
          })
        })
        this.logger.log(
          `${
            this.label
          } settleBondedWithdrawal on chain ${chainId} tx: ${chalk.bgYellow.black.bold(
            tx.hash
          )}`
        )
        delete store.transferHashes[transferHash]
      } catch (err) {
        if (err.message !== 'cancelled') {
          this.logger.error(
            `${this.label} settleBondedWithdrawal tx error:`,
            err.message
          )
        }
      }
    }
  }

  async watch () {
    this.l1BridgeContract
      .on(
        this.l1BridgeContract.filters.TransferRootBonded(),
        this.handleTransferRootBondedEvent
      )
      .on('error', err => {
        this.logger.error(`${this.label} event watcher error:`, err.message)
      })
  }

  async getBonderAddress () {
    return this.l1BridgeContract.signer.getAddress()
  }
}

export default SettleBondedWithdrawalWatcher
