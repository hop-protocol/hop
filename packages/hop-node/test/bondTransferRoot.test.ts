import Logger from 'src/logger'
import { Chain } from 'src/constants'
import { User, waitForEvent } from './helpers'
import { privateKey } from './config'
import { startWatchers } from 'src/watchers/watchers'
import { wait } from 'src/utils'
require('dotenv').config()

const TOKEN = 'DAI'
const TRANSFER_AMOUNT = 1
const logger = new Logger('TEST')

describe('bondTransferRoot', () => {
  const testPaths = [[Chain.xDai, Chain.Ethereum]]
  for (const path of testPaths) {
    const [sourceNetwork, destNetwork] = path
    const label = `${sourceNetwork} → ${destNetwork}`
    it(
      label,
      async () => {
        logger.log(label)
        const user = new User(privateKey)
        const recipient = await user.getAddress()
        const { stop, watchers } = startWatchers({ networks: path })
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
        await waitForEvent(
          watchers,
          'bondWithdrawal',
          data => data.recipient === recipient
        )
        logger.log('waiting for event')
        await waitForEvent(watchers, 'bondTransferRoot', data => {
          return true
        })
        await stop()
        await wait(2 * 20000)
      },
      500 * 1000
    )
  }
})
