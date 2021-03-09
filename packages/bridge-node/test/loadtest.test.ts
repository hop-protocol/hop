require('dotenv').config()
import { HDNode } from '@ethersproject/hdnode'
import { KOVAN, ARBITRUM, XDAI } from 'src/constants'
import { startWatchers } from 'src/watchers/watchers'
import { wait } from 'src/utils'
import { User, checkApproval } from './helpers'
import { faucetPrivateKey, mnemonic } from './config'

const sourceNetwork = ARBITRUM
const destNetwork = KOVAN
const token = 'DAI'
const TRANSFER_AMOUNT = 1
const NUM_USERS = 5

test(
  'loadtest',
  async () => {
    const users = generateUsers(NUM_USERS)
    await prepareAccounts(users)
    const { stop } = startWatchers()

    const [sourceBalancesBefore, destBalancesBefore] = await getBalances(users)
    for (let i = 0; i < users.length; i++) {
      const sourceBalanceBefore = sourceBalancesBefore[i]
      expect(sourceBalanceBefore > 0).toBe(true)
    }
    await Promise.all(
      users.map(async user => {
        const spender = user.getBridgeAddress(sourceNetwork, token)
        await checkApproval(user, sourceNetwork, token, spender)
        const tx = await user.send(
          sourceNetwork,
          destNetwork,
          token,
          TRANSFER_AMOUNT
        )
        return tx?.wait()
      })
    )

    await wait(60 * 1000)
    const [sourceBalancesAfter, destBalancesAfter] = await getBalances(users)

    for (let i = 0; i < users.length; i++) {
      const sourceBalanceBefore = sourceBalancesBefore[i]
      const sourceBalanceAfter = sourceBalancesAfter[i]
      const destBalanceBefore = destBalancesBefore[i]
      const destBalanceAfter = destBalancesAfter[i]
      expect(sourceBalanceAfter + TRANSFER_AMOUNT).toBe(sourceBalanceBefore)
      expect(destBalanceAfter > destBalanceBefore).toBe(true)
    }

    await stop()
    expect(true).toBe(true)
  },
  300 * 1000
)

function generateUsers (count: number = 1) {
  const users: User[] = []
  for (let i = 0; i < count; i++) {
    const path = `m/44'/60'/0'/0/${i}`
    let hdnode = HDNode.fromMnemonic(mnemonic)
    hdnode = hdnode.derivePath(path)
    const privateKey = hdnode.privateKey
    const user = new User(privateKey)
    users.push(user)
  }

  return users
}

async function prepareAccounts (users: User[]) {
  const faucet = new User(faucetPrivateKey)
  for (let user of users) {
    const address = await user.getAddress()
    if ([KOVAN, XDAI].includes(sourceNetwork)) {
      let ethBal = await user.getBalance(sourceNetwork)
      if (ethBal < 0.01) {
        const tx = await faucet.sendEth(0.1, address)
        await tx.wait()
        ethBal = await user.getBalance()
      }
      expect(ethBal >= 0.01).toBe(true)
    }
    let tokenBal = await user.getBalance(sourceNetwork, token)
    if (tokenBal < 1) {
      const tx = await faucet.sendTokens(sourceNetwork, token, 1000, address)
      await tx.wait()
      tokenBal = await user.getBalance(sourceNetwork, token)
    }
    expect(tokenBal >= 1).toBe(true)
  }
  return users
}

async function getBalances (users: User[]): Promise<any[]> {
  return Promise.all([
    Promise.all(
      users.map((user: User) => user.getBalance(sourceNetwork, token))
    ),
    Promise.all(users.map((user: User) => user.getBalance(destNetwork, token)))
  ])
}
