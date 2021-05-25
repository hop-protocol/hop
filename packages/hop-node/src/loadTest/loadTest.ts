require('dotenv').config()
import expect from 'expect'
import { startWatchers } from 'src/watchers/watchers'
import { wait } from 'src/utils'
import {
  User,
  waitForEvent,
  generateUsers,
  prepareAccounts,
  getBalances
} from '../../test/helpers'
import { faucetPrivateKey, mnemonic } from '../../test/config'
import Logger from 'src/logger'
// @ts-ignore
import { Chain } from 'src/constants'
import { Notifier } from 'src/notifier'

const paths = [[Chain.Polygon, Chain.Ethereum]]
const tokens = ['USDC']
const transferAmount = 10

type Config = {
  concurrentUsers: number
}

class LoadTest {
  concurrentUsers: number

  constructor (config: Config) {
    this.concurrentUsers = config.concurrentUsers
  }

  async start () {
    while (true) {
      for (let path of paths) {
        for (let token of tokens) {
          const sourceNetwork = path[0]
          const destNetwork = path[1]
          const label = `${token} ${sourceNetwork} → ${destNetwork}`
          const logger = new Logger({
            tag: 'LoadTest',
            prefix: label
          })
          const notifier = new Notifier('LoadTest')
          try {
            const faucet = new User(faucetPrivateKey)
            const users = generateUsers(this.concurrentUsers, mnemonic)
            await prepareAccounts(
              users,
              faucet,
              token,
              sourceNetwork,
              transferAmount
            )

            logger.log('reading balances')
            const [
              sourceBalancesBefore,
              destBalancesBefore
            ] = await getBalances(users, token, sourceNetwork, destNetwork)
            for (let i = 0; i < users.length; i++) {
              const sourceBalanceBefore = sourceBalancesBefore[i]
              logger.log(`user #${i} - checking balances`)
              expect(sourceBalanceBefore).toBeGreaterThan(0)
            }
            await Promise.all(
              users.map(async (user: User, i: number) => {
                const recipient = await user.getAddress()
                const spender = user.getBridgeAddress(sourceNetwork, token)
                logger.log(`user #${i} - checking approval`)
                await user.checkApproval(sourceNetwork, token, spender)
                logger.log(`user #${i} - sending tx`)
                const tx = await user.send(
                  sourceNetwork,
                  destNetwork,
                  token,
                  transferAmount
                )
                logger.log(`user #${i} - tx hash: ${tx.hash}`)
                logger.log(`user #${i} - waiting for receipt`)
                await tx?.wait()
              })
            )

            logger.log(`waiting for bonded withdrawals`)
            await wait(300 * 1000)
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
              expect(sourceBalanceAfter + transferAmount).toBe(
                sourceBalanceBefore
              )
              expect(destBalanceAfter).toBeGreaterThan(destBalanceBefore)
            }
            logger.log('success')
          } catch (err) {
            console.log(err)
            logger.error('load test error:', err.message)
            notifier.error(`${label}\n${err.message}`)
            logger.log('waiting 15 seconds before trying again')
            await wait(15 * 1000)
          }
        }
      }
    }
  }
}

export default LoadTest
