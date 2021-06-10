import { BigNumber } from 'ethers'
import contracts from 'src/contracts'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import { config } from 'src/config'
import { wait, chainIdToSlug } from 'src/utils'
import Logger from 'src/logger'
import { Chain } from 'src/constants'
import { DateTime } from 'luxon'

class HealthCheck {
  logger: Logger
  bridges: L2Bridge[] = []
  minThresholdAmount: number = 100

  constructor () {
    this.logger = new Logger('HealthCheck')
    const tokens: string[] = ['USDC', 'DAI']
    const networks: string[] = ['optimism', 'xdai']
    for (let token of tokens) {
      for (let network of networks) {
        const tokenContracts = contracts.get(token, network)
        const bridgeContract = tokenContracts.l2Bridge
        const bridge = new L2Bridge(bridgeContract)
        this.bridges.push(bridge)
      }
    }
  }

  async start () {
    this.logger.debug('starting health check watcher')
    while (true) {
      try {
        await this.check()
        this.logger.debug('waiting 20s for next poll')
        await wait(20 * 1000)
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
    const endBlockNumber = await bridge.getBlockNumber()
    const startBlockNumber = endBlockNumber - 10_000

    const destBridgeEvents: any = {}

    await bridge.eventsBatch(
      async (start: number, end: number) => {
        const events = await bridge.getTransferSentEvents(start, end)
        for (let event of events) {
          const tx = await event.getTransaction()
          const { transferId } = event.args
          const { chainId: destinationChainId } = await bridge.decodeSendData(
            tx.data
          )
          const sourceChain = await bridge.getChainSlug()
          const destinationChain = bridge.chainIdToSlug(destinationChainId)
          const tokenSymbol = bridge.tokenSymbol
          const path = `${sourceChain}.${tokenSymbol}→${destinationChain}`

          //this.logger.debug(`checking bonded withdrawals ${path}`)
          const waitMinutes = 1
          const timestamp = await bridge.getTransferSentTimestamp(transferId)
          if (!timestamp) {
            this.logger.error('no timestamp found')
            continue
          }
          const timeAgo = DateTime.now()
            .minus({ minutes: waitMinutes })
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
          if (!config?.bonders?.length) {
            throw new Error('bonders array is empty')
          }
          const bonder = config.bonders[0]
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
            this.logger.warn(
              `(${path}) transfer id (${transferId}) (sent ${sentAt} ${tx.hash}) has not been bonded yet.`
            )
          }

          if (bondedAmount.eq(0)) {
            const cachedEvents = destBridgeEvents[destinationChainId]
            if (!cachedEvents) {
              const destEndBlockNumber = await destBridge.getBlockNumber()
              const destStartBlockNumber = destEndBlockNumber - 100_000
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

    //this.logger.debug(`done checking bonded withdrawals ${path}`)
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
    //this.logger.debug(`checking commit transfers ${path}`)
    const shouldBeCommitted = amount.gte(
      bridge.parseUnits(this.minThresholdAmount)
    )
    if (shouldBeCommitted) {
      this.logger.warn(
        `(${path}) total ${
          pendingTransfers.length
        } pending transfers amount (${bridge.formatUnits(
          amount
        )}) met min threshold (${
          this.minThresholdAmount
        }) but has not committed yet.`
      )
    }
    //this.logger.debug(`done checking commit transfers ${path}`)
  }

  async checkTransferRootBonded (bridge: L2Bridge) {
    const sourceChain = await bridge.getChainSlug()
    const tokenSymbol = bridge.tokenSymbol
    const path = `${sourceChain}.${tokenSymbol}`
    //this.logger.debug(`check transfer root bonded ${path}`)

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

    const isConfirmed = await l1Bridge.isTransferRootIdConfirmed(
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

    const waitMinutes = 1
    const timeAgo = DateTime.now()
      .minus({ minutes: waitMinutes })
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
      return
    }

    //this.logger.debug(`done checking transfer bonded ${path}`)
  }

  async checkBondedWithdrawalSettlements (bridge: L2Bridge) {
    const sourceChain = await bridge.getChainSlug()
    const tokenSymbol = bridge.tokenSymbol
    const path = `${sourceChain}.${tokenSymbol}`
    //this.logger.debug(`checking bonded withdrawal settlements ${path}`)

    const endBlockNumber = await bridge.getBlockNumber()
    const startBlockNumber = endBlockNumber - 10_000

    const bondedTransferIds: any[] = []

    await bridge.eventsBatch(
      async (start: number, end: number) => {
        const events = await bridge.getTransferSentEvents(start, end)
        for (let event of events) {
          const tx = await event.getTransaction()
          const { transferId, amount, index } = event.args
          const { chainId: destinationChainId } = await bridge.decodeSendData(
            tx.data
          )
          const destBridge = this.bridges.find((bridge: L2Bridge) => {
            return bridge.chainId === destinationChainId
          })
          if (!destBridge) {
            continue
          }
          const destinationChain = destBridge.chainIdToSlug(destinationChainId)
          if (!config?.bonders?.length) {
            throw new Error('bonders array is empty')
          }
          const bonder = config.bonders[0]
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
          if (!config?.bonders?.length) {
            throw new Error('bonders array is empty')
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
          const bondTx = await bondEvent?.getTransaction()
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
            for (let event of events) {
              const { bonder, rootHash, totalBondsSettled } = event.args
              const tx = await event.getTransaction()
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

    const unsettledTransferIds: any[] = bondedTransferIds.filter(
      ({ transferId }) => {
        return !settledTransferIds.includes(transferId)
      }
    )
    for (let {
      transferId,
      destinationChainId,
      timestamp,
      txHash
    } of unsettledTransferIds) {
      const bondedAt = DateTime.fromSeconds(timestamp).toRelative()
      const destinationChain = bridge.chainIdToSlug(destinationChainId)
      const path = `${sourceChain}.${tokenSymbol}→${destinationChain}`
      this.logger.warn(
        `(${path}) bonded transfer id (${transferId}) (bonded ${bondedAt} ${txHash}) has not been settled yet.`
      )
    }

    //this.logger.debug(`done checking bonded withdrawal settlements ${path}`)
  }
}

export default HealthCheck
