import { privateKey } from './config'
import { User } from './helpers'
import { Chain } from 'src/constants'

const network = Chain.Ethereum
const token = 'USDC'
const amount = 1_000_000_000

test(
  'mint',
  async () => {
    const user = new User(privateKey)
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
