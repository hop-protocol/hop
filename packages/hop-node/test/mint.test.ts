import { privateKey } from './config'
import { User } from './helpers'
import { Chain } from 'src/constants'

const network = Chain.Optimism
const token = 'USDC'
const amount = 1_000_000_000

test(
  'mint',
  async () => {
    const user = new User(privateKey)
    const recipient = await user.getAddress()
    const tokenBalanceBefore = await user.getBalance(network, token, recipient)
    const tx = await user.mint(network, token, amount, recipient)
    console.log('tx hash:', tx.hash)
    const receipt = await tx.wait()
    expect(receipt.status).toBe(1)
    const tokenBalanceAfter = await user.getBalance(network, token, recipient)
    expect(tokenBalanceAfter).toBeGreaterThan(tokenBalanceBefore)
  },
  60 * 1000
)
