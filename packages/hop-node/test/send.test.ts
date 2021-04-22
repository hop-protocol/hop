import { privateKey } from './config'
import { User } from './helpers'
// @ts-ignore
import { ETHEREUM, XDAI, OPTIMISM, DAI } from 'src/constants'

const sourceNetwork = XDAI
const destNetwork = ETHEREUM
const token = 'USDC'
const amount = 1

test.only(
  'send',
  async () => {
    const user = new User(privateKey)
    const tokenBalanceBefore = await user.getHopBalance(sourceNetwork, token)
    const tx = await user.send(sourceNetwork, destNetwork, token, amount)
    console.log('tx hash:', tx.hash)
    const receipt = await tx.wait()
    expect(receipt.status).toBe(1)
    const tokenBalanceAfter = await user.getHopBalance(sourceNetwork, token)
    expect(tokenBalanceBefore).toBeGreaterThan(tokenBalanceAfter)
  },
  60 * 1000
)

test(
  'swapAndSend',
  async () => {
    const user = new User(privateKey)
    const tokenBalanceBefore = await user.getBalance(sourceNetwork, token)
    console.log('balance before:', tokenBalanceBefore)
    const tx = await user.swapAndSend(sourceNetwork, destNetwork, token, amount)
    console.log('tx hash:', tx.hash)
    const receipt = await tx.wait()
    expect(receipt.status).toBe(1)
    const tokenBalanceAfter = await user.getBalance(sourceNetwork, token)
    expect(tokenBalanceBefore).toBeGreaterThan(tokenBalanceAfter)
  },
  60 * 1000
)
