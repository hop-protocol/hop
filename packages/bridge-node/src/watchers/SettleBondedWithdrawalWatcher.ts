import '../moduleAlias'
import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait, networkIdToSlug } from 'src/utils'
import { store } from 'src/store'
import chalk from 'chalk'
import BaseWatcher from 'src/watchers/BaseWatcher'

export interface Config {
  l1BridgeContract: Contract
  l2BridgeContract: Contract
  contracts: { [networkId: string]: Contract }
  label: string
  order?: () => number
}

const cache: { [key: string]: boolean } = {}

class SettleBondedWithdrawalWatcher extends BaseWatcher {
  l1BridgeContract: Contract
  l2BridgeContract: Contract
  contracts: { [networkId: string]: Contract }

  constructor (config: Config) {
    super({
      tag: 'settleBondedWithdrawalWatcher',
      prefix: config.label,
      logColor: 'magenta',
      order: config.order
    })
    this.l1BridgeContract = config.l1BridgeContract
    this.l2BridgeContract = config.l2BridgeContract
    this.contracts = config.contracts
  }

  async start () {
    this.started = true
    this.logger.log(`starting L1 BondTransferRoot event watcher`)
    try {
      await this.watch()
    } catch (err) {
      this.emit('error', err)
      this.logger.error(`watcher error:`, err)
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
    transferRootHash: string,
    totalAmount: number,
    proof: string[]
  ) => {
    const cacheKey = `${transferRootHash}${chainId}`
    if (cache[cacheKey]) {
      throw new Error('cancelled')
    }
    const onchainRoot = await this.l1BridgeContract.getTransferRoot(
      transferRootHash,
      parseUnits(totalAmount.toString(), 18)
    )
    this.logger.log('settleBondedWithdrawal params:')
    this.logger.log('chainId:', chainId)
    this.logger.log('transferHash:', transferHash)
    this.logger.log('transferRootHash:', transferRootHash)
    this.logger.log(`onchain transferRootHash:`, onchainRoot)
    this.logger.log('proof:', proof)
    const bondedAmount = await this.getBondedAmount(transferHash, chainId)
    this.logger.log('bonded amount:', bondedAmount)
    this.logger.log('total amount:', totalAmount)
    this.logger.log(`l1 settleBondedWithdrawal amount: ${bondedAmount}`)
    cache[cacheKey] = true
    return this.settleBondedWithdrawal(
      transferHash,
      transferRootHash,
      totalAmount,
      proof,
      chainId
    )
  }

  settleBondedWithdrawal = async (
    transferHash: string,
    transferRootHash: string,
    totalAmount: number,
    proof: string[],
    chainId: string
  ) => {
    const bridge = this.contracts[chainId]
    const bonder = await this.getBonderAddress()
    const parsedAmount = parseUnits(totalAmount.toString(), 18)
    return bridge.settleBondedWithdrawal(
      bonder,
      transferHash,
      transferRootHash,
      parsedAmount,
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
    transferRootHash: string,
    _totalAmount: string,
    meta: any
  ) => {
    const { transactionHash } = meta
    const totalAmount = Number(formatUnits(_totalAmount, 18))
    this.logger.log(`received L1 BondTransferRoot event:`)
    this.logger.log(`bondRoot: ${transferRootHash}`)
    this.logger.log(`bondAmount: ${totalAmount}`)
    this.logger.log(`event transactionHash: ${transactionHash}`)

    // TODO: batch
    const proof = []
    const transfers: any[] = Object.values(store.transferHashes)
    this.logger.log(`transfers:`, transfers.length)
    for (let item of transfers) {
      try {
        const { transferHash, chainId } = item
        const tx = await this.sendTx(
          chainId,
          transferHash,
          transferRootHash,
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
          `settleBondedWithdrawal on chain ${chainId} tx: ${chalk.bgYellow.black.bold(
            tx.hash
          )}`
        )
        delete store.transferHashes[transferHash]
      } catch (err) {
        if (err.message !== 'cancelled') {
          this.emit('error', err)
          this.logger.error(`settleBondedWithdrawal tx error:`, err.message)
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
        this.emit('error', err)
        this.logger.error(`event watcher error:`, err.message)
      })
  }

  async getBonderAddress () {
    return this.l1BridgeContract.signer.getAddress()
  }
}

export default SettleBondedWithdrawalWatcher
