require('dotenv').config()
import { startWatchers } from 'src/watchers/watchers'
import { tokens } from 'src/config'
import { wait, isL1 } from 'src/utils'
import { KOVAN, OPTIMISM, ARBITRUM, XDAI } from 'src/constants'
import { User } from './helpers'

const paths = [
  // L1 -> L2
  [KOVAN, ARBITRUM],
  [KOVAN, OPTIMISM],
  [KOVAN, XDAI],

  // L2 -> L1
  [ARBITRUM, KOVAN],
  [OPTIMISM, KOVAN],
  [XDAI, KOVAN],

  // L2 -> L2
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
  const label = `${sourceNetwork} -> ${destNetwork}`
  test(
    label,
    async () => {
      console.log(label)
      await prepareAccount(sourceNetwork, TOKEN)
      const user = new User(privateKey)
      const address = await user.getAddress()
      const { stop, watchers } = startWatchers()
      const sourceBalanceBefore = await user.getBalance(sourceNetwork, TOKEN)
      const destBalanceBefore = await user.getBalance(destNetwork, TOKEN)
      console.log('before:', sourceBalanceBefore, destBalanceBefore)
      const receipt = await user.sendAndWaitForReceipt(
        sourceNetwork,
        destNetwork,
        TOKEN,
        TRANSFER_AMOUNT
      )
      expect(receipt.status).toBe(1)
      if (isL1(sourceNetwork)) {
        await wait(10 * 1000)
      } else {
        await waitForEvent(
          watchers,
          'bondWithdrawal',
          data => data.recipient === address
        )
      }
      const sourceBalanceAfter = await user.getBalance(sourceNetwork, TOKEN)
      const destBalanceAfter = await user.getBalance(destNetwork, TOKEN)
      expect(sourceBalanceAfter + TRANSFER_AMOUNT).toBe(sourceBalanceBefore)
      console.log('after:', destBalanceAfter, destBalanceBefore)
      expect(destBalanceAfter > destBalanceBefore).toBe(true)
      await stop()
    },
    300 * 1000
  )
}

async function waitForEvent (
  watchers: any[],
  eventName: string,
  predicate: any
) {
  return new Promise(resolve => {
    watchers.forEach(watcher => {
      watcher.on(eventName, data => {
        console.log('event:', eventName, data)
        if (predicate(data)) {
          resolve()
        }
      })
    })
  })
}

async function prepareAccount (sourceNetwork: string, token: string) {
  const user = new User(privateKey)
  const balance = await user.getBalance(sourceNetwork, token)
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
