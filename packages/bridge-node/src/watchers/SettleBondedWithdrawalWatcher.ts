import '../moduleAlias'
import { Contract } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait, networkIdToSlug } from 'src/utils'
import { BondTransferRootEvent } from 'src/constants'
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
    this.logger.log('starting L1 BondTransferRoot event watcher')
    try {
      await this.watch()
    } catch (err) {
      this.logger.error('watcher error:', err)
    }
  }

  async stop () {
    this.l1BridgeContract.off(
      BondTransferRootEvent,
      this.handleBondTransferEvent
    )
    this.started = false
  }

  sendTx = async (
    chainId: string,
    transferHash: string,
    rootHash: string,
    proof: string[]
  ) => {
    const cacheKey = `${rootHash}${chainId}`
    if (cache[cacheKey]) {
      throw new Error('cancelled')
    }
    this.logger.log('settleBondedWithdrawal params:')
    this.logger.log('chainId:', chainId)
    this.logger.log('transferHash:', transferHash)
    this.logger.log('rootHash:', rootHash)
    this.logger.log('proof:', proof)
    cache[cacheKey] = true
    const bondedAmount = await this.getBondedAmount(transferHash, chainId)
    if (bondedAmount === 0) {
      throw new Error('cancelled')
    }
    this.logger.log(
      `${this.label} l1 settleBondedWithdrawal amount: ${bondedAmount}`
    )
    return this.settleBondedWithdrawal(
      transferHash,
      rootHash,
      bondedAmount.toString(),
      proof,
      chainId
    )
  }

  settleBondedWithdrawal = async (
    transferHash: string,
    rootHash: string,
    rootTotal: string,
    proof: any[],
    chainId: string
  ) => {
    const bridge = this.contracts[chainId]
    if (chainId === '77') {
      const bonder = await this.getBonderAddress()
      return bridge.settleBondedWithdrawal(
        bonder,
        transferHash,
        rootHash,
        parseUnits(rootTotal, 18),
        proof
      )
    }

    return bridge.settleBondedWithdrawal(transferHash, rootHash, proof)
  }

  getBondedAmount = async (transferHash: string, chainId: string) => {
    let bondedBn: any
    const bridge = this.contracts[chainId]
    if (chainId === '77') {
      const bonder = await this.getBonderAddress()
      bondedBn = await bridge.getBondedWithdrawalAmount(bonder, transferHash)
    } else {
      bondedBn = await bridge.getBondedWithdrawalAmount(transferHash)
    }
    const bondedAmount = Number(formatUnits(bondedBn.toString(), 18))
    return bondedAmount
  }

  handleBondTransferEvent = async (
    bondRoot: string,
    bondAmount: string,
    meta: any
  ) => {
    const { transactionHash } = meta
    await wait(5 * 1000)
    this.logger.log(
      'received L1 BondTransferRoot event:',
      bondRoot,
      bondAmount.toString(),
      transactionHash
    )

    const proof = []
    const transfers: any[] = Object.values(store.transferHashes)
    this.logger.log('transfers:', transfers.length)
    for (let item of transfers) {
      try {
        const { transferHash, computedTransferHash, chainId } = item
        const tx = await this.sendTx(
          chainId,
          computedTransferHash,
          bondRoot,
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
          this.logger.error('settleBondedWithdrawal tx error:', err.message)
        }
      }
    }
  }

  async watch () {
    this.l1BridgeContract
      .on(BondTransferRootEvent, this.handleBondTransferEvent)
      .on('error', err => {
        this.logger.error('event watcher error:', err.message)
      })
  }

  async getBonderAddress () {
    return this.l1BridgeContract.signer.getAddress()
  }
}

export default SettleBondedWithdrawalWatcher
