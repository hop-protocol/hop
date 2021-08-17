import Logger from 'src/logger'
import { Chain } from 'src/constants'
import {
  User,
  generateUsers,
  getBalances,
  prepareAccounts,
  waitForEvent
} from './helpers'
import { faucetPrivateKey, mnemonic } from './config'
import { startWatchers } from 'src/watchers/watchers'
import { wait } from 'src/utils'
require('dotenv').config()

const sourceNetwork = Chain.xDai
const destNetwork = Chain.Ethereum
const token = 'USDC'
const TRANSFER_AMOUNT = 1
const NUM_USERS = 2
const logger = new Logger('TEST')

test(
  'loadtest',
  async () => {
    const faucet = new User(faucetPrivateKey)
    const users = generateUsers(NUM_USERS, mnemonic)
    await prepareAccounts(users, faucet, token, sourceNetwork)
    const { stop, watchers } = startWatchers({
      networks: [sourceNetwork, destNetwork]
    })

    logger.log('reading balances')
    const [sourceBalancesBefore, destBalancesBefore] = await getBalances(
      users,
      token,
      sourceNetwork,
      destNetwork
    )
    for (let i = 0; i < users.length; i++) {
      const sourceBalanceBefore = sourceBalancesBefore[i]
      logger.log('checking balances')
      expect(sourceBalanceBefore).toBeGreaterThan(0)
    }
    await Promise.all(
      users.map(async (user: User) => {
        const recipient = await user.getAddress()
        const spender = user.getBridgeAddress(sourceNetwork, token)
        logger.log('checking approval')
        await user.checkApproval(sourceNetwork, token, spender)
        logger.log('sending tx')
        const tx = await user.send(
          sourceNetwork,
          destNetwork,
          token,
          TRANSFER_AMOUNT
        )
        logger.log('waiting')
        tx?.wait()
        await waitForEvent(
          watchers,
          'bondWithdrawal',
          data => data.recipient === recipient
        )
      })
    )

    await wait(120 * 1000)
    logger.log('reading balances')
    const [sourceBalancesAfter, destBalancesAfter] = await getBalances(
      users,
      token,
      sourceNetwork,
      destNetwork
    )

    logger.log('comparing balances')
    for (let i = 0; i < users.length; i++) {
      const sourceBalanceBefore = sourceBalancesBefore[i]
      const sourceBalanceAfter = sourceBalancesAfter[i]
      const destBalanceBefore = destBalancesBefore[i]
      const destBalanceAfter = destBalancesAfter[i]
      expect(sourceBalanceAfter + TRANSFER_AMOUNT).toBe(sourceBalanceBefore)
      expect(destBalanceAfter).toBeGreaterThan(destBalanceBefore)
    }

    await stop()
  },
  300 * 1000
)
