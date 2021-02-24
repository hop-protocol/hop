require('dotenv').config()
import { startWatchers } from 'src/watchers/watchers'
import { tokens } from 'src/config'
import { wait } from 'src/utils'
import { KOVAN, OPTIMISM, ARBITRUM, XDAI } from 'src/constants'
import { User } from './helpers'

const paths = [
  [KOVAN, ARBITRUM],
  [KOVAN, OPTIMISM],
  [KOVAN, XDAI],
  [ARBITRUM, KOVAN],
  [OPTIMISM, KOVAN],
  [XDAI, KOVAN],
  [OPTIMISM, ARBITRUM],
  [OPTIMISM, XDAI],
  [ARBITRUM, OPTIMISM],
  [ARBITRUM, XDAI],
  [XDAI, OPTIMISM],
  [XDAI, ARBITRUM]
]

const TOKEN = 'DAI'
const TRANSFER_AMOUNT = 1
const privateKey = process.env.TEST_USER_PRIVATE_KEY

for (let path of paths) {
  const [sourceNetwork, destNetwork] = path
  test(
    `${sourceNetwork} -> ${destNetwork}`,
    async () => {
      await prepareAccount(sourceNetwork, TOKEN)
      const user = new User(privateKey)
      const stop = startWatchers()
      const sourceBalanceBefore = await user.getBalance(sourceNetwork, TOKEN)
      const destBalanceBefore = await user.getBalance(destNetwork, TOKEN)
      const receipt = await user.sendAndWaitForReceipt(
        sourceNetwork,
        destNetwork,
        TOKEN,
        TRANSFER_AMOUNT
      )
      expect(receipt.status).toBe(1)
      // TODO: read event emitted from watcher
      await wait(50 * 1000)
      const sourceBalanceAfter = await user.getBalance(sourceNetwork, TOKEN)
      const destBalanceAfter = await user.getBalance(destNetwork, TOKEN)
      expect(sourceBalanceAfter + TRANSFER_AMOUNT).toBe(sourceBalanceBefore)
      console.log(destBalanceAfter, destBalanceBefore)
      expect(destBalanceAfter > destBalanceBefore).toBe(true)
      await stop()
      await wait(5 * 1000)
    },
    300 * 1000
  )
}

async function prepareAccount (sourceNetwork: string, token: string) {
  const user = new User(privateKey)
  const balance = await user.getBalance(sourceNetwork, token)
  console.log('balance:', balance)
  if (balance < 10) {
    // TODO: sent L1 token to L2 over bridge instead of mint (mint not always supported)
    const tx = await user.mint(sourceNetwork, token, 1000)
    await tx?.wait()
  }
  expect(balance > 0).toBe(true)
  let spender = tokens[token][sourceNetwork].l2Bridge
  if (sourceNetwork === KOVAN) {
    spender = tokens[token][sourceNetwork].l1Bridge
  }
  let allowance = await user.getAllowance(sourceNetwork, token, spender)
  if (allowance < 1000) {
    const tx = await user.approve(sourceNetwork, token, spender)
    await tx?.wait()
  }
  allowance = await user.getAllowance(sourceNetwork, token, spender)
  expect(allowance > 0).toBe(true)
  // NOTE: xDai SPOA token is required for fees.
  // faucet: https://blockscout.com/poa/sokol/faucet
  if (sourceNetwork === XDAI) {
    const ethBalance = await user.getBalance(sourceNetwork)
    expect(ethBalance > 0).toBe(true)
  }
}
