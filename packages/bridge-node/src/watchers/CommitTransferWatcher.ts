import '../moduleAlias'
import { Contract } from 'ethers'
import chalk from 'chalk'
import { wait } from 'src/utils'
import { throttle } from 'src/utils'
import db from 'src/db'
import BaseWatcher from 'src/watchers/BaseWatcher'
import MerkleTree from 'src/lib/MerkleTree'

export interface Config {
  l2BridgeContract: Contract
  contracts: { [networkId: string]: Contract }
  label: string
  order?: () => number
}

class CommitTransfersWatcher extends BaseWatcher {
  l2BridgeContract: Contract
  contracts: { [networkId: string]: Contract }

  constructor (config: Config) {
    super({
      tag: 'commitTransferWatcher',
      prefix: config.label,
      logColor: 'yellow',
      order: config.order
    })
    this.l2BridgeContract = config.l2BridgeContract
    this.contracts = config.contracts
  }

  async start () {
    this.started = true
    this.logger.log(`starting L2 commitTransfers scheduler`)
    this.getRecentTransferHashesForCommittedRoots().then(this.logger.error)
    try {
      await this.watch()
    } catch (err) {
      this.emit('error', err)
      this.logger.error('watcher error:', err)
    }
  }

  async stop () {
    this.l2BridgeContract.off(
      this.l2BridgeContract.filters.TransferSent(),
      this.handleTransferSentEvent
    )
    this.started = false
    this.logger.setEnabled(false)
  }

  sendCommitTransfersTx = async (chainId: string) => {
    return this.l2BridgeContract.commitTransfers(chainId, {
      //gasLimit: '0xf4240'
    })
  }

  check = throttle(async (chainId: string) => {
    if (!chainId) {
      throw new Error('chainId is required')
    }
    const pendingAmount = Number(
      (await this.l2BridgeContract.pendingAmountForChainId(chainId)).toString()
    )
    if (pendingAmount <= 0) {
      return
    }

    const lastCommitTime = (
      await this.l2BridgeContract.lastCommitTimeForChainId(chainId)
    ).toNumber()
    const minimumForceCommitDelay = (
      await this.l2BridgeContract.minimumForceCommitDelay()
    ).toNumber()
    const minForceCommitTime = lastCommitTime + minimumForceCommitDelay
    const isBonder = await this.isBonder()
    const l2ChainId = (await this.l2BridgeContract.getChainId()).toNumber()
    this.logger.log('chainId:', l2ChainId)
    this.logger.log('destinationChainId:', chainId)
    this.logger.log('lastCommitTime:', lastCommitTime)
    this.logger.log('minimumForceCommitDelay:', minimumForceCommitDelay)
    this.logger.log('minForceCommitTime:', minForceCommitTime)
    this.logger.log('isBonder:', isBonder)

    if (minForceCommitTime >= Date.now() && !isBonder) {
      this.logger.warn('only Bonder can commit before min delay')
    }

    const pendingTransfers: Buffer[] = await this.getPendingTransfers(chainId)
    const pendingTransfersHex = pendingTransfers.map(
      x => '0x' + x.toString('hex')
    )
    this.logger.log('onchain pendingTransfers', pendingTransfersHex)
    const tree = new MerkleTree(pendingTransfers)
    const transferRootHash = tree.getHexRoot()
    this.logger.log(
      chainId,
      'calculated transferRootHash:',
      chalk.bgMagenta.black(transferRootHash)
    )
    await db.transferRoots.update(transferRootHash, {
      transferRootHash,
      transferHashes: pendingTransfersHex
    })

    const tx = await this.sendCommitTransfersTx(chainId)
    tx?.wait().then(() => {
      this.emit('commitTransfers', {
        chainId
      })
    })
    this.logger.log(
      `L2 commitTransfers tx:`,
      chalk.bgYellow.black.bold(tx.hash)
    )
  }, 15 * 1000)

  handleTransferSentEvent = async (
    transferHash: string,
    recipient: string,
    amount: string,
    transferNonce: string,
    relayerFee: string,
    meta: any
  ) => {
    try {
      this.logger.log(`received TransferSent event`)
      this.logger.log(`waiting`)
      // TODO: batch
      const { transactionHash } = meta
      const {
        from: sender,
        data
      } = await this.l2BridgeContract.provider.getTransaction(transactionHash)

      let chainId = ''
      try {
        const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
          'swapAndSend',
          data
        )
        chainId = decoded.chainId.toString()
      } catch (err) {
        const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
          'send()',
          data
        )
        chainId = decoded.chainId.toString()
      }

      const sourceChainId = (
        await this.l2BridgeContract.getChainId()
      ).toString()
      await db.transfers.update(transferHash, {
        transferHash,
        chainId,
        sourceChainId
      })
    } catch (err) {
      if (err.message !== 'cancelled') {
        this.emit('error', err)
        this.logger.error('commitTransfers tx error:', err.message)
      }
    }
  }

  async watch () {
    this.l2BridgeContract
      .on(
        this.l2BridgeContract.filters.TransferSent(),
        this.handleTransferSentEvent
      )
      .on('error', err => {
        this.emit('error', err)
        this.logger.error('event watcher error:', err.message)
      })

    while (true) {
      if (!this.started) return
      try {
        const chainIds = Object.keys(this.contracts)
        for (let chainId of chainIds) {
          //const transferRoots = await db.transferRoots.getUncommittedBondedTransferRoots()
          const pendingTransfers = await this.getPendingTransfers(chainId)
          if (pendingTransfers.length > 0) {
            await this.check(chainId)
          }
        }
      } catch (err) {
        this.logger.error('error checking:', err.message)
      }
      await wait(10 * 1000)
    }
  }

  async isBonder () {
    const bonder = await this.getBonderAddress()
    return this.l2BridgeContract.getIsBonder(bonder)
  }

  async getBonderAddress () {
    return this.l2BridgeContract.signer.getAddress()
  }

  async getPendingTransfers (chainId: string) {
    const pendingTransfers: Buffer[] = []
    const max = (await this.l2BridgeContract.maxPendingTransfers()).toNumber()
    for (let i = 0; i < max; i++) {
      try {
        const pendingTransfer = await this.l2BridgeContract.pendingTransferIdsForChainId(
          chainId,
          i
        )
        pendingTransfers.push(
          Buffer.from(pendingTransfer.replace('0x', ''), 'hex')
        )
      } catch (err) {
        break
      }
    }

    return pendingTransfers
  }

  async getRecentTransferHashesForCommittedRoots () {
    const blockNumber = await this.l2BridgeContract.provider.getBlockNumber()
    let start = blockNumber - 1000
    const transferCommits = await this.l2BridgeContract.queryFilter(
      this.l2BridgeContract.filters.TransfersCommitted(),
      start
    )
    if (!transferCommits.length) {
      return
    }
    const transferCommitsMap: any = {}
    for (let i = 0; i < transferCommits.length; i++) {
      let { topics, blockNumber, transactionHash } = transferCommits[i]
      const { data } = await this.l2BridgeContract.provider.getTransaction(
        transactionHash
      )
      let chainId = ''
      try {
        const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
          'commitTransfers',
          data
        )
        chainId = decoded.destinationChainId.toString()
      } catch (err) {}
      if (!chainId) {
        continue
      }
      const transferRootHash = topics[1]
      const prevBlockNumber =
        i === 0 ? start : transferCommits[i - 1].blockNumber
      if (!transferCommitsMap[chainId]) {
        transferCommitsMap[chainId] = {}
      }
      transferCommitsMap[chainId] = {
        [transferRootHash]: {
          transferRootHash,
          transferHashes: [],
          prevBlockNumber,
          blockNumber
        }
      }
    }

    for (let destChainId in transferCommitsMap) {
      for (let transferRootHash in transferCommitsMap[destChainId]) {
        let {
          prevBlockNumber,
          blockNumber,
          transferHashes
        } = transferCommitsMap[destChainId][transferRootHash]
        const recentEvents = await this.l2BridgeContract.queryFilter(
          this.l2BridgeContract.filters.TransferSent(),
          prevBlockNumber - 1,
          blockNumber + 1
        )

        for (let event of recentEvents) {
          const { data } = await this.l2BridgeContract.provider.getTransaction(
            event.transactionHash
          )

          let chainId = ''
          try {
            const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
              'swapAndSend',
              data
            )
            chainId = decoded.chainId.toString()
          } catch (err) {
            const decoded = await this.l2BridgeContract.interface.decodeFunctionData(
              'send()',
              data
            )
            chainId = decoded.chainId.toString()
          }

          if (chainId === destChainId) {
            transferHashes.push(event.topics[1])
          }
        }

        const leaves = transferHashes.map(x =>
          Buffer.from(x.replace('0x', ''), 'hex')
        )
        if (leaves.length) {
          const tree = new MerkleTree(leaves)
          if (tree.getHexRoot() === transferRootHash) {
            db.transferRoots.update(transferRootHash, {
              transferHashes: transferHashes,
              commited: true
            })
          } else {
            this.logger.error(
              'merkle hex root does not match commited transfer root'
            )
          }
        }
      }
    }
  }
}

export default CommitTransfersWatcher
