import { KOVAN, XDAI, OPTIMISM, DAI } from 'src/constants'
import { privateKey } from './config'
import { User } from './helpers'

console.log(KOVAN, OPTIMISM, XDAI)

test(
  'mint',
  async () => {
    const user = new User(privateKey)
    const network = OPTIMISM
    const token = DAI
    const amount = 10000
    const tokenBalanceBefore = await user.getBalance(network, token)
    const tx = await user.mint(network, token, amount)
    console.log('tx hash:', tx.hash)
    const receipt = await tx.wait()
    expect(receipt.status).toBe(1)
    const tokenBalanceAfter = await user.getBalance(network, token)
    expect(tokenBalanceAfter).toBeGreaterThan(tokenBalanceBefore)
  },
  60 * 1000
)
