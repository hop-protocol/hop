import Logger from 'src/logger'
import { Chain } from 'src/constants'
import { User, waitForEvent } from './helpers'
import { privateKey } from './config'
import { startWatchers } from 'src/watchers/watchers'
require('dotenv').config()

const L2ToL1Paths = [
  [Chain.Arbitrum, Chain.Ethereum],
  [Chain.Optimism, Chain.Ethereum],
  [Chain.xDai, Chain.Ethereum]
]

const L2ToL2Paths = [
  [Chain.Optimism, Chain.Arbitrum],
  [Chain.Optimism, Chain.xDai],
  [Chain.Arbitrum, Chain.Optimism],
  [Chain.Arbitrum, Chain.xDai],
  [Chain.xDai, Chain.Optimism],
  [Chain.xDai, Chain.Arbitrum]
]

const TOKEN = 'DAI'
const TRANSFER_AMOUNT = 1
const logger = new Logger('TEST')

describe('settleBondedWithdrawal', () => {
  let testPaths = [...L2ToL1Paths, ...L2ToL2Paths]
  testPaths = [[Chain.xDai, Chain.xDai]]
  for (const path of testPaths) {
    const [sourceNetwork, destNetwork] = path
    const label = `${sourceNetwork} → ${destNetwork}`
    const txCount = 1
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        const recipient = await user.getAddress()
        const { stop, watchers } = startWatchers({ networks: path })

        const promises: Promise<any>[] = []
        for (let i = 0; i < txCount; i++) {
          promises.push(
            new Promise(async resolve => {
              logger.log('sending and waiting for receipt')
              const receipt = await user.sendAndWaitForReceipt(
                sourceNetwork,
                destNetwork,
                TOKEN,
                TRANSFER_AMOUNT
              )
              expect(receipt.status).toBe(1)
              logger.log('got receipt')
              logger.log('waiting for bondWithdrawal event')
              let transferHash: string
              await waitForEvent(watchers, 'bondWithdrawal', data => {
                if (data.recipient === recipient) {
                  transferHash = data.transferHash
                  return true
                }
                return false
              })
              logger.log('waiting for bondTransferRoot event')
              await waitForEvent(watchers, 'bondTransferRoot', data => {
                return true
              })
              logger.log('waiting for event')
              await waitForEvent(watchers, 'settleBondedWithdrawal', data => {
                if (data.transferHash === transferHash) {
                  return true
                }
                return false
              })
              resolve(null)
            })
          )
        }

        await Promise.all(promises)

        await stop()
      },
      900 * 1000
    )
  }
})
