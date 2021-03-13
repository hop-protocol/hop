require('dotenv').config()
import { startWatchers } from 'src/watchers/watchers'
import { networkSlugToId } from 'src/utils'
import { KOVAN, ARBITRUM, XDAI } from 'src/constants'
import { User, waitForEvent } from './helpers'
import { privateKey, bonderPrivateKey } from './config'
import { keccak256 } from 'ethereumjs-util'
import Logger from 'src/logger'

const L2ToL1Paths = [
  [ARBITRUM, KOVAN],
  //[OPTIMISM, KOVAN],
  [XDAI, KOVAN]
]

const L2ToL2Paths = [
  //[OPTIMISM, ARBITRUM],
  //[OPTIMISM, XDAI],
  //[ARBITRUM, OPTIMISM],
  [ARBITRUM, XDAI],
  //[XDAI, OPTIMISM],
  [XDAI, ARBITRUM]
]

const TOKEN = 'DAI'
const TRANSFER_AMOUNT = 1
const logger = new Logger('TEST')

describe('settleBondedWithdrawal', () => {
  let testPaths = [...L2ToL1Paths, ...L2ToL2Paths]
  testPaths = [[XDAI, KOVAN]]
  for (let path of testPaths) {
    const [sourceNetwork, destNetwork] = path
    const label = `${sourceNetwork} -> ${destNetwork}`
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
      500 * 1000
    )
  }
})

describe('challenge', () => {
  const networks = [KOVAN]
  for (let network of networks) {
    const chainId = networkSlugToId(network)
    const label = `${network}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        const bonder = new User(bonderPrivateKey)
        const { stop, watchers } = startWatchers({ networks: [KOVAN, XDAI] })
        logger.log('sending and waiting for receipt')
        const sourceNetwork = XDAI
        const destNetwork = KOVAN
        let receipt = await user.sendAndWaitForReceipt(
          sourceNetwork,
          destNetwork,
          TOKEN,
          TRANSFER_AMOUNT
        )
        logger.log('got transfer receipt')

        const invalidTransferRoot =
          '0x' + keccak256(Buffer.from(Date.now().toString())).toString('hex')
        const totalAmount = 1
        logger.log('bonding invalid transfer root')
        logger.log('invalid transferRootHash:', invalidTransferRoot)
        receipt = await bonder.bondTransferRootAndWaitForReceipt(
          invalidTransferRoot,
          chainId,
          totalAmount
        )
        expect(receipt.status).toBe(1)
        logger.log('got bond invalid transfer root receipt')
        await waitForEvent(
          watchers,
          'challengeTransferRootBond',
          data => data.transferRootHash === invalidTransferRoot
        )
        await stop()
      },
      500 * 1000
    )
  }
})
