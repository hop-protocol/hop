require('dotenv').config()
import { ethers, Wallet, providers } from 'ethers'
import { HDNode } from '@ethersproject/hdnode'
import { getRpcUrl, wait } from 'src/utils'
import { User, checkApproval } from './helpers'
import { KOVAN, ARBITRUM, OPTIMISM, XDAI } from 'src/constants'
import { startWatchers } from 'src/watchers/watchers'

const mnemonic = process.env.TEST_MNEMONIC
const provider = new providers.StaticJsonRpcProvider(getRpcUrl(KOVAN))

const sourceNetwork = OPTIMISM
const destNetwork = ARBITRUM
const token = 'DAI'
const TRANSFER_AMOUNT = 1

test(
  'loadtest',
  async () => {
    const users = generateUsers(1)
    await prepareAccounts(users)
    const { stop, watchers } = startWatchers()

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
      if (!(destBalanceAfter > destBalanceBefore)) {
        process.exit(0)
      }
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
  const faucetPrivateKey = process.env.TEST_FAUCET_PRIVATE_KEY
  const faucet = new User(faucetPrivateKey)
  for (let user of users) {
    const address = await user.getAddress()
    let ethBal = await user.getBalance(KOVAN)
    if (ethBal < 0.01) {
      const tx = await faucet.sendEth(0.1, address)
      await tx.wait()
      ethBal = await user.getBalance()
    }
    expect(ethBal >= 0.01).toBe(true)
    let tokenBal = await user.getBalance(KOVAN, token)
    if (tokenBal < 1) {
      console.log('minting')
      const tx = await user.mint(KOVAN, token, 1000)
      await tx.wait()
      tokenBal = await user.getBalance(KOVAN, token)
    }
    expect(tokenBal >= 1).toBe(true)
  }
  return users
}

async function getBalances (users): Promise<any[]> {
  return Promise.all([
    Promise.all(users.map(user => user.getBalance(sourceNetwork, token))),
    Promise.all(users.map(user => user.getBalance(destNetwork, token)))
  ])
}
