import '../moduleAlias'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import Logger from 'src/logger'
import contracts from 'src/contracts'
import fs from 'fs'
import { config as globalConfig } from 'src/config'

class Events {
  logger: Logger
  bridges: any[] = []

  constructor () {
    this.logger = new Logger('Events')
    const tokens: string[] = globalConfig.isMainnet ? ['USDC'] : ['DAI', 'USDC']
    const networks: string[] = globalConfig.isMainnet
      ? ['ethereum', 'xdai', 'polygon']
      : ['ethereum', 'optimism', 'xdai']
    for (const token of tokens) {
      for (const network of networks) {
        const tokenContracts = contracts.get(token, network)
        const isL1 = network === 'ethereum'
        let bridge: any
        if (isL1) {
          const bridgeContract = tokenContracts.l1Bridge
          bridge = new L1Bridge(bridgeContract)
        } else {
          const bridgeContract = tokenContracts.l2Bridge
          bridge = new L2Bridge(bridgeContract)
        }
        this.bridges.push({
          isL1,
          bridge
        })
      }
    }
  }

  async getEvents () {
    const events: any = await Promise.all(
      this.bridges.map(({ bridge, isL1 }) => {
        return this.getEventsForBridge(bridge, isL1)
      })
    )
    return events.flat()
  }

  async getEventsForBridge (bridge: any, isL1: boolean) {
    const result: any[] = []
    if (isL1) {
      // TODO
    } else {
      bridge = bridge as L2Bridge
      await bridge.eventsBatch(async (start: number, end: number) => {
        const sourceChainId = bridge.chainId
        const events = await bridge.getTransferSentEvents(start, end)
        for (const event of events) {
          const tx = await event.getTransaction()
          const { destinationChainId } = await bridge.decodeSendData(tx.data)
          const amount = event.args.amount.toString()
          const transferId = event.args.transferId.toString()
          const obj = {
            sourceChainId,
            destinationChainId,
            amount,
            transferId
          }
          console.log(obj)
          result.push(obj)
        }
      })
    }
    return result
  }
}

async function main () {
  const e = new Events()
  const events = await e.getEvents()
  const json = JSON.stringify(events, null, 2)
  fs.writeFileSync('transferSends.json.log', json, 'utf8')
  process.exit(0)
}

main()
