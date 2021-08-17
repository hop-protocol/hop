import Logger from 'src/logger'
import { Chain } from 'src/constants'
import { User, prepareAccount } from './helpers'
import { privateKey } from './config'
import { startWatchers } from 'src/watchers/watchers'
import { wait } from 'src/utils'
require('dotenv').config()

const sourceNetwork = Chain.Optimism
const destNetwork = Chain.Ethereum
const TOKEN = 'DAI'
const TRANSFER_AMOUNT = 100000
const logger = new Logger('TEST')

describe('arb-bot', () => {
  it(
    `send ${TRANSFER_AMOUNT} ${TOKEN} ${sourceNetwork} → ${Chain.Ethereum}`,
    async () => {
      const user = new User(privateKey)
      logger.log('preparing account')
      await prepareAccount(user, sourceNetwork, TOKEN)
      const tx = await user.mint(sourceNetwork, TOKEN, TRANSFER_AMOUNT)
      await tx.wait()
      logger.log('starting watchers')
      const { stop } = startWatchers({
        networks: [sourceNetwork, destNetwork]
      })
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
      await wait(30 * 1000)
      await stop()
    },
    900 * 1000
  )
})
