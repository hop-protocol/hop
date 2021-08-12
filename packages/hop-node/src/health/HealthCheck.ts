import L2Bridge from 'src/watchers/classes/L2Bridge'
import Logger from 'src/logger'
import contracts from 'src/contracts'
import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import { DateTime } from 'luxon'
import { Notifier } from 'src/notifier'
import { chainIdToSlug, wait } from 'src/utils'
import { config as globalConfig, hostname } from 'src/config'

type Config = {
  bondWithdrawalTimeLimitMinutes: number
  bondTransferRootTimeLimitMinutes: number
  commitTransfersMinThresholdAmount: number
  pollIntervalSeconds: number
}

class HealthCheck {
  logger: Logger
  notifier: Notifier
  bridges: L2Bridge[] = []
  bondWithdrawalTimeLimitMinutes: number = 5
  bondTransferRootTimeLimitMinutes: number = 5
  commitTransfersMinThresholdAmount: number = 100
  pollIntervalSeconds: number = 20

  constructor (config: Partial<Config> = {}) {
    this.logger = new Logger('HealthCheck')
    this.notifier = new Notifier(`watcher: HealthCheck, host: ${hostname}`)

    if (config.bondWithdrawalTimeLimitMinutes) {
      this.bondWithdrawalTimeLimitMinutes =
        config.bondWithdrawalTimeLimitMinutes
    }
    if (config.bondTransferRootTimeLimitMinutes) {
      this.bondTransferRootTimeLimitMinutes =
        config.bondTransferRootTimeLimitMinutes
    }
    if (config.commitTransfersMinThresholdAmount) {
      this.commitTransfersMinThresholdAmount =
        config.commitTransfersMinThresholdAmount
    }
    if (config.pollIntervalSeconds) {
      this.pollIntervalSeconds = config.pollIntervalSeconds
    }

    const tokens: string[] = Object.keys(globalConfig.tokens)
    const networks: string[] = Object.keys(globalConfig.networks).filter(
      network => network !== Chain.Ethereum
    )
    for (const token of tokens) {
      for (const network of networks) {
        const tokenContracts = contracts.get(token, network)
        if (!tokenContracts) {
          continue
        }
        const bridgeContract = tokenContracts.l2Bridge
        const bridge = new L2Bridge(bridgeContract)
        this.bridges.push(bridge)
      }
    }
  }

  async start () {
    this.logger.debug(
      `config: bondWithdrawalTimeLimitMinutes: ${this.bondWithdrawalTimeLimitMinutes}`
    )
    this.logger.debug(
      `config: bondTransferRootTimeLimitMinutes: ${this.bondTransferRootTimeLimitMinutes}`
    )
    this.logger.debug(
      `config: commitTransfersMinThresholdAmount: ${this.commitTransfersMinThresholdAmount}`
    )
    this.logger.debug(
      `config: pollIntervalSeconds: ${this.pollIntervalSeconds}`
    )
    this.logger.debug('starting health check watcher')
    while (true) {
      try {
        await this.check()
        this.logger.debug(`waiting ${this.pollIntervalSeconds}s for next poll`)
        await wait(this.pollIntervalSeconds * 1000)
      } catch (err) {
        this.logger.error(`check error: ${err.message}`)
      }
    }
  }

  async check () {
    this.logger.debug('--- poll ---')
    await Promise.all(
      this.bridges.map((bridge: L2Bridge) => this.checkBridge(bridge))
    )
  }

  async checkBridge (bridge: L2Bridge) {
    await Promise.all([
      this.checkCommitTransfers(bridge),
      this.checkBondedWithdrawals(bridge),
      this.checkTransferRootBonded(bridge),
      this.checkBondedWithdrawalSettlements(bridge)
    ])
  }

  async checkBondedWithdrawals (bridge: L2Bridge) {
    const TOTAL_BLOCKS = 100_000
    const endBlockNumber = await bridge.getBlockNumber()
    const startBlockNumber = endBlockNumber - TOTAL_BLOCKS

    const destBridgeEvents: any = {}

    await bridge.eventsBatch(
      async (start: number, end: number) => {
        const events = await bridge.getTransferSentEvents(start, end)
        for (const event of events) {
          const { transactionHash } = event
          const tx = await bridge.getTransaction(transactionHash)
          const { transferId } = event.args
          const { destinationChainId } = await bridge.decodeSendData(tx.data)
          const sourceChain = await bridge.getChainSlug()
          const destinationChain = bridge.chainIdToSlug(destinationChainId)
          const tokenSymbol = bridge.tokenSymbol
          const path = `${sourceChain}.${tokenSymbol}→${destinationChain}`

          // this.logger.debug(`checking bonded withdrawals ${path}`)
          const timestamp = await bridge.getTransferSentTimestamp(transferId)
          if (!timestamp) {
            this.logger.error('no timestamp found')
            continue
          }
          const timeAgo = DateTime.now()
            .minus({ minutes: this.bondWithdrawalTimeLimitMinutes })
            .toSeconds()
          // skip if transfer sent events are recent (in the last few minutes)
          if (timestamp > timeAgo) {
            continue
          }
          const destBridge = this.bridges.find((bridge: L2Bridge) => {
            return bridge.chainId === destinationChainId
          })
          if (!destBridge) {
            continue
          }
          if (!globalConfig?.bonders) {
            throw new Error('bonders object is empty')
          }
          const bonder = globalConfig?.bonders?.[tokenSymbol]?.[0]
          const bondedAmount = await destBridge.getBondedWithdrawalAmountByBonder(
            bonder,
            transferId
          )

          const check = (_events: any[]) => {
            const found = _events.find((_event: any) => {
              return _event.args.transferId === transferId
            })
            if (found) {
              return
            }
            const sentAt = DateTime.fromSeconds(timestamp).toRelative()
            const log = `(${path}) transfer id (${transferId}) (sent ${sentAt} ${tx.hash}) has not been bonded yet.`
            this.logger.warn(log)
            this.notifier.warn(log)
          }

          if (bondedAmount.eq(0)) {
            const cachedEvents = destBridgeEvents[destinationChainId]
            if (!cachedEvents) {
              const TOTAL_BLOCKS = 100_000
              const destEndBlockNumber = await destBridge.getBlockNumber()
              const destStartBlockNumber = destEndBlockNumber - TOTAL_BLOCKS
              destBridgeEvents[destinationChainId] = []
              await bridge.eventsBatch(
                async (_start: number, _end: number) => {
                  const _events = await destBridge.getWithdrawalBondedEvents(
                    _start,
                    _end
                  )
                  destBridgeEvents[destinationChainId].push(..._events)
                },
                {
                  startBlockNumber: destStartBlockNumber,
                  endBlockNumber: destEndBlockNumber
                }
              )
            }
            await check(destBridgeEvents[destinationChainId])
          }
        }
      },
      {
        startBlockNumber,
        endBlockNumber
      }
    )

    // this.logger.debug(`done checking bonded withdrawals ${path}`)
  }

  async checkCommitTransfers (bridge: L2Bridge) {
    const chainIds = await bridge.getChainIds()
    return Promise.all(
      chainIds.map((destinationChainId: number) =>
        this.checkCommitTransfersForChain(bridge, destinationChainId)
      )
    )
  }

  async checkCommitTransfersForChain (
    bridge: L2Bridge,
    destinationChainId: number
  ) {
    const chainId = await bridge.getChainId()
    const pendingTransfers = await bridge.getPendingTransfers(
      destinationChainId
    )
    const amount = await bridge.getPendingAmountForChainId(destinationChainId)
    const sourceChain = await bridge.getChainSlug()
    const destinationChain = bridge.chainIdToSlug(destinationChainId)
    const tokenSymbol = bridge.tokenSymbol
    const path = `${sourceChain}.${tokenSymbol}→${destinationChain}`
    // this.logger.debug(`checking commit transfers ${path}`)
    const shouldBeCommitted = amount.gte(
      bridge.parseUnits(this.commitTransfersMinThresholdAmount)
    )
    if (shouldBeCommitted) {
      const log = `(${path}) total ${
        pendingTransfers.length
      } pending transfers amount (${bridge.formatUnits(
        amount
      )}) met min threshold (${
        this.commitTransfersMinThresholdAmount
      }) but has not committed yet.`
      this.logger.warn(log)
      this.notifier.warn(log)
    }
    // this.logger.debug(`done checking commit transfers ${path}`)
  }

  async checkTransferRootBonded (bridge: L2Bridge) {
    const sourceChain = await bridge.getChainSlug()
    const tokenSymbol = bridge.tokenSymbol
    const path = `${sourceChain}.${tokenSymbol}`
    // this.logger.debug(`check transfer root bonded ${path}`)

    const l1Bridge = await bridge.getL1Bridge()
    const chainId = await bridge.getChainId()
    const transfersCommittedEvent = await bridge.getLastTransfersCommittedEvent()
    if (!transfersCommittedEvent) {
      return
    }

    const rootHash = transfersCommittedEvent.args.rootHash
    const totalAmount = transfersCommittedEvent.args.totalAmount
    const committedTransferRootId = await l1Bridge.getTransferRootId(
      rootHash,
      totalAmount
    )

    // TODO: Use dest chainId
    const isConfirmed = await l1Bridge.isTransferRootIdConfirmed(
      chainId,
      committedTransferRootId
    )
    if (isConfirmed) {
      return
    }

    const committedAt = Number(
      transfersCommittedEvent.args.rootCommittedAt.toString()
    )
    const skipChains: string[] = [Chain.xDai, Chain.Polygon]
    if (skipChains.includes(chainIdToSlug(chainId))) {
      return
    }

    const timeAgo = DateTime.now()
      .minus({ minutes: this.bondTransferRootTimeLimitMinutes })
      .toSeconds()
    // skip if committed time was less than a few minutes ago
    if (committedAt > timeAgo) {
      return
    }

    const isBonded = await l1Bridge.isTransferRootIdBonded(
      committedTransferRootId
    )
    if (!isBonded) {
      const relativeTime = DateTime.fromSeconds(committedAt).toRelative()
      this.logger.warn(
        `(${path}) transferRootId (${committedTransferRootId}) has been committed (${relativeTime}) but not bonded on L1`
      )
    }

    // this.logger.debug(`done checking transfer bonded ${path}`)
  }

  async checkBondedWithdrawalSettlements (bridge: L2Bridge) {
    const TOTAL_BLOCKS = 100_000
    const sourceChain = await bridge.getChainSlug()
    const tokenSymbol = bridge.tokenSymbol
    const path = `${sourceChain}.${tokenSymbol}`
    // this.logger.debug(`checking bonded withdrawal settlements ${path}`)

    const endBlockNumber = await bridge.getBlockNumber()
    const startBlockNumber = endBlockNumber - TOTAL_BLOCKS

    const bondedTransferIds: any[] = []

    await bridge.eventsBatch(
      async (start: number, end: number) => {
        const events = await bridge.getTransferSentEvents(start, end)
        for (const event of events) {
          const { transactionHash } = event
          const tx = await bridge.getTransaction(transactionHash)
          const { transferId, amount, index } = event.args
          const { destinationChainId } = await bridge.decodeSendData(tx.data)
          const destBridge = this.bridges.find((bridge: L2Bridge) => {
            return bridge.chainId === destinationChainId
          })
          if (!destBridge) {
            continue
          }

          const destinationChain = destBridge.chainIdToSlug(destinationChainId)
          if (!globalConfig?.bonders) {
            throw new Error('bonders object is empty')
          }
          const bonder = globalConfig?.bonders?.[tokenSymbol]?.[0]
          /*
          const bondedAmount = await destBridge.getBondedWithdrawalAmountByBonder(
            bonder,
            transferId
          )
          */
          /*
          // if it's zero, then it doesn't exist or it's already been settled
          if (bondedAmount.eq(0)) {
            continue
          }
          */
          if (!globalConfig?.bonders) {
            throw new Error('bonders object is empty')
          }
          const destEndBlockNumber = await destBridge.getBlockNumber()
          const destStartBlockNumber = destEndBlockNumber - 1_000
          const bondEvent = await destBridge.getBondedWithdrawalEvent(
            transferId,
            destStartBlockNumber,
            destEndBlockNumber
          )
          const timestamp = await destBridge.getEventTimestamp(bondEvent)
          if (!timestamp) {
            continue
          }
          const bondTx = await destBridge.getTransaction(
            bondEvent.transactionHash
          )
          bondedTransferIds.push({
            transferId,
            destinationChainId,
            bonder,
            timestamp,
            txHash: bondTx?.hash
          })
        }
      },
      {
        startBlockNumber,
        endBlockNumber
      }
    )

    const settledTransferIds: string[] = []
    await Promise.all(
      bondedTransferIds.map(async ({ transferId, destinationChainId }) => {
        const destBridge = this.bridges.find((bridge: L2Bridge) => {
          return bridge.chainId === destinationChainId
        })
        if (!destBridge) {
          return false
        }
        const endBlockNumber = await destBridge.getBlockNumber()
        const startBlockNumber = endBlockNumber - 50_000
        await destBridge.eventsBatch(
          async (start: number, end: number) => {
            const events = await destBridge.getMultipleWithdrawalsSettledEvents(
              start,
              end
            )
            for (const event of events) {
              const { transactionHash } = event
              const { bonder, rootHash, totalBondsSettled } = event.args
              const tx = await destBridge.getTransaction(transactionHash)
              const {
                transferIds,
                totalAmount
              } = await destBridge.decodeSettleBondedWithdrawalsData(tx.data)
              const isSettled = transferIds.includes(transferId)
              if (isSettled) {
                settledTransferIds.push(transferId)
                return false
              }
            }
          },
          {
            startBlockNumber,
            endBlockNumber
          }
        )
      })
    )

    const minThresholdPercent: number = 0.5 // 50%
    const totalBondsSettleAmounts: any = {}
    const totals: any = {}
    for (const { transferId, destinationChainId } of bondedTransferIds) {
      const bonder = globalConfig.bonders?.[tokenSymbol]?.[0]
      const destBridge = this.bridges.find((bridge: L2Bridge) => {
        return bridge.chainId === destinationChainId
      })
      if (!destBridge) {
        continue
      }

      const transferBondAmount = await destBridge.getBondedWithdrawalAmountByBonder(
        bonder,
        transferId
      )
      if (!totalBondsSettleAmounts[destinationChainId]) {
        totalBondsSettleAmounts[destinationChainId] = BigNumber.from(0)
      }
      totalBondsSettleAmounts[destinationChainId] = totalBondsSettleAmounts[
        destinationChainId
      ].add(transferBondAmount)
    }

    const needsSettlement: any = {}
    const chainIds = await bridge.getChainIds()
    for (const destinationChainId of chainIds) {
      const destBridge = this.bridges.find((bridge: L2Bridge) => {
        return bridge.chainId === destinationChainId
      })
      if (!destBridge) {
        continue
      }
      const [credit, debit] = await Promise.all([
        destBridge.getCredit(),
        destBridge.getDebit()
      ])

      const totalBondsSettleAmount = totalBondsSettleAmounts[destinationChainId]
      if (!totalBondsSettleAmount) {
        continue
      }

      const bonderDestBridgeStakedAmount = credit.sub(debit)
      if (
        bonderDestBridgeStakedAmount.gt(0) &&
        totalBondsSettleAmount
          .div(bonderDestBridgeStakedAmount)
          .gte(BigNumber.from(minThresholdPercent * 100).div(100))
      ) {
        needsSettlement[destinationChainId] = true
      }
    }

    console.log(bondedTransferIds)

    const unsettledTransferIds: any[] = bondedTransferIds.filter(
      ({ transferId }) => {
        return !settledTransferIds.includes(transferId)
      }
    )
    for (const {
      transferId,
      destinationChainId,
      timestamp,
      txHash
    } of unsettledTransferIds) {
      if (!needsSettlement[destinationChainId]) {
        continue
      }
      const bondedAt = DateTime.fromSeconds(timestamp).toRelative()
      const destinationChain = bridge.chainIdToSlug(destinationChainId)
      const path = `${sourceChain}.${tokenSymbol}→${destinationChain}`
      const log = `(${path}) bonded transfer id (${transferId}) (bonded ${bondedAt} ${txHash}) has not been settled yet (maybe transfer root has not been confirmed?).`
      this.logger.warn(log)
      this.notifier.warn(log)
    }

    // this.logger.debug(`done checking bonded withdrawal settlements ${path}`)
  }
}

export default HealthCheck
