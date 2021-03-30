import { privateKey } from './config'
import { User } from './helpers'
// @ts-ignore
import { KOVAN, XDAI, OPTIMISM, DAI } from 'src/constants'

const sourceNetwork = XDAI
const destNetwork = OPTIMISM
const token = 'DAI'
const amount = 1000

test(
  'send',
  async () => {
    const user = new User(privateKey)
    const tokenBalanceBefore = await user.getHopBalance(sourceNetwork, token)
    const tx = await user.bridgeSend(sourceNetwork, destNetwork, token, amount)
    console.log('tx hash:', tx.hash)
    const receipt = await tx.wait()
    expect(receipt.status).toBe(1)
    const tokenBalanceAfter = await user.getHopBalance(sourceNetwork, token)
    expect(tokenBalanceBefore).toBeGreaterThan(tokenBalanceAfter)
  },
  60 * 1000
)

test.only(
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
