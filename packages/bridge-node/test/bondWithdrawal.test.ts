require('dotenv').config()
import { startWatchers } from 'src/watchers/watchers'
import { wait, isL1 } from 'src/utils'
import { KOVAN, ARBITRUM, OPTIMISM, XDAI } from 'src/constants'
import { User, waitForEvent, prepareAccount } from './helpers'
import { privateKey } from './config'
import Logger from 'src/logger'

const L1ToL2Paths = [
  [KOVAN, ARBITRUM],
  [KOVAN, OPTIMISM],
  [KOVAN, XDAI]
]

const L2ToL1Paths = [
  [ARBITRUM, KOVAN],
  [OPTIMISM, KOVAN],
  [XDAI, KOVAN]
]

const L2ToL2Paths = [
  [OPTIMISM, ARBITRUM],
  [OPTIMISM, XDAI],
  [ARBITRUM, OPTIMISM],
  [ARBITRUM, XDAI],
  [XDAI, OPTIMISM],
  [XDAI, ARBITRUM]
]

const TOKEN = 'DAI'
const TRANSFER_AMOUNT = 1
const logger = new Logger('TEST')

describe('bondWithdrawal', () => {
  let testPaths = [...L1ToL2Paths, ...L2ToL1Paths, ...L2ToL2Paths]
  testPaths = [[OPTIMISM, XDAI]]
  for (let path of testPaths) {
    const [sourceNetwork, destNetwork] = path
    const label = `${sourceNetwork} -> ${destNetwork}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        await prepareAccount(user, sourceNetwork, TOKEN)
        const recipient = await user.getAddress()
        const { stop, watchers } = startWatchers({ networks: path })
        const sourceBalanceBefore = await user.getBalance(sourceNetwork, TOKEN)
        expect(sourceBalanceBefore).toBeGreaterThan(TRANSFER_AMOUNT)
        const destBalanceBefore = await user.getBalance(destNetwork, TOKEN)
        logger.log('source balance before:', sourceBalanceBefore)
        logger.log('dest balance before:', destBalanceBefore)
        logger.log('send and wait for receipt')
        const receipt = await user.sendAndWaitForReceipt(
          sourceNetwork,
          destNetwork,
          TOKEN,
          TRANSFER_AMOUNT
        )
        expect(receipt.status).toBe(1)
        logger.log('got receipt')
        if (isL1(sourceNetwork)) {
          logger.log('waiting')
          await wait(40 * 1000)
        } else {
          await waitForEvent(
            watchers,
            'bondWithdrawal',
            data => data.recipient === recipient
          )
          await wait(20 * 1000)
        }
        const sourceBalanceAfter = await user.getBalance(sourceNetwork, TOKEN)
        const destBalanceAfter = await user.getBalance(destNetwork, TOKEN)
        expect(sourceBalanceAfter + TRANSFER_AMOUNT).toBe(sourceBalanceBefore)
        logger.log('source balance after:', sourceBalanceAfter)
        logger.log('dest balance after:', destBalanceAfter)
        expect(destBalanceAfter).toBeGreaterThan(destBalanceBefore)
        await stop()
      },
      300 * 1000
    )
  }
})
