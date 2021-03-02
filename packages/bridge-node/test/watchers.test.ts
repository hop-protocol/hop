require('dotenv').config()
import { startWatchers } from 'src/watchers/watchers'
import { tokens } from 'src/config'
import { wait, isL1 } from 'src/utils'
import { KOVAN, OPTIMISM, ARBITRUM, XDAI } from 'src/constants'
import { User, checkApproval } from './helpers'

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

const paths = [...L1ToL2Paths, ...L2ToL1Paths, ...L2ToL2Paths]

const TOKEN = 'DAI'
const TRANSFER_AMOUNT = 1
const privateKey = process.env.TEST_USER_PRIVATE_KEY

describe.only('settleBondedWithdrawal', () => {
  const sourceNetwork = OPTIMISM
  const destNetwork = XDAI
  const label = `${sourceNetwork} -> ${destNetwork}`
  it(
    label,
    async () => {
      const user = new User(privateKey)
      const { stop, watchers } = startWatchers()
      const receipt = await user.sendAndWaitForReceipt(
        sourceNetwork,
        destNetwork,
        TOKEN,
        TRANSFER_AMOUNT
      )
      expect(receipt.status).toBe(1)
      await waitForEvent(watchers, 'settleBondedWithdrawal', data => {
        console.log('DATA', data)
        return true
      })
      console.log('RE', receipt)
      await stop()
    },
    300 * 1000
  )
})

describe('bondWithdrawal', () => {
  for (let path of paths) {
    const [sourceNetwork, destNetwork] = path
    const label = `${sourceNetwork} -> ${destNetwork}`
    it(
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
        if (!(destBalanceAfter > destBalanceBefore)) {
          process.exit(0)
        }
        await stop()
      },
      300 * 1000
    )
  }
})

async function waitForEvent (
  watchers: any[],
  eventName: string,
  predicate?: (data: any) => boolean
) {
  return new Promise(resolve => {
    watchers.forEach(watcher => {
      watcher.on(eventName, data => {
        console.log('event:', eventName, data)
        if (typeof predicate !== 'function') {
          resolve(null)
          return
        }
        if (predicate(data)) {
          resolve(null)
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
  const spender = user.getBridgeAddress(sourceNetwork, token)
  await checkApproval(user, sourceNetwork, token, spender)
  // NOTE: xDai SPOA token is required for fees.
  // faucet: https://blockscout.com/poa/sokol/faucet
  if (sourceNetwork === XDAI) {
    const ethBalance = await user.getBalance(sourceNetwork)
    expect(ethBalance > 0).toBe(true)
  }
}
