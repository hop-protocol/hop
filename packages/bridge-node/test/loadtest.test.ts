require('dotenv').config()
import { startWatchers } from 'src/watchers/watchers'
import { wait } from 'src/utils'
import { User, checkApproval, waitForEvent, generateUsers } from './helpers'
import { faucetPrivateKey, mnemonic } from './config'
import Logger from 'src/logger'
// @ts-ignore
import { OPTIMISM, KOVAN, XDAI } from 'src/constants'

const sourceNetwork = OPTIMISM
const destNetwork = KOVAN
const token = 'DAI'
const TRANSFER_AMOUNT = 1
const NUM_USERS = 1000
const logger = new Logger('TEST')

test(
  'loadtest',
  async () => {
    const users = generateUsers(NUM_USERS, mnemonic)
    await prepareAccounts(users)
    const { stop, watchers } = startWatchers({
      networks: [sourceNetwork, destNetwork]
    })

    logger.log('reading balances')
    const [sourceBalancesBefore, destBalancesBefore] = await getBalances(users)
    for (let i = 0; i < users.length; i++) {
      const sourceBalanceBefore = sourceBalancesBefore[i]
      logger.log('checking balances')
      expect(sourceBalanceBefore).toBeGreaterThan(0)
    }
    await Promise.all(
      users.map(async user => {
        const recipient = await user.getAddress()
        const spender = user.getBridgeAddress(sourceNetwork, token)
        logger.log('checking approval')
        await checkApproval(user, sourceNetwork, token, spender)
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
    const [sourceBalancesAfter, destBalancesAfter] = await getBalances(users)

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

export async function prepareAccounts (users: User[]) {
  const faucet = new User(faucetPrivateKey)
  for (let user of users) {
    logger.log('preparing account')
    const address = await user.getAddress()
    if ([KOVAN, XDAI].includes(sourceNetwork)) {
      let ethBal = await user.getBalance(sourceNetwork)
      if (ethBal < 0.1) {
        logger.log('faucet sending eth')
        const tx = await faucet.sendEth(0.1, address, sourceNetwork)
        const receipt = await tx.wait()
        expect(receipt.status).toBe(1)
        ethBal = await user.getBalance(sourceNetwork)
      }
      expect(ethBal).toBeGreaterThanOrEqual(0.1)
    }
    let tokenBal = await user.getBalance(sourceNetwork, token)
    if (tokenBal < 1) {
      logger.log('faucet sending tokens')
      const tx = await faucet.sendTokens(sourceNetwork, token, 1000, address)
      await tx.wait()
      tokenBal = await user.getBalance(sourceNetwork, token)
    }
    expect(tokenBal).toBeGreaterThanOrEqual(1)
  }
  return users
}

export async function getBalances (users: User[]): Promise<any[]> {
  return Promise.all([
    Promise.all(
      users.map((user: User) => user.getBalance(sourceNetwork, token))
    ),
    Promise.all(users.map((user: User) => user.getBalance(destNetwork, token)))
  ])
}
