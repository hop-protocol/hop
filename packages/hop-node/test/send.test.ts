import { Chain } from 'src/constants'
import { User } from './helpers'
import { privateKey } from './config'

const sourceNetwork = Chain.xDai
const destNetwork = Chain.Ethereum
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
