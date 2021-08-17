import { Chain } from 'src/constants'
import { User } from './helpers'
import { privateKey } from './config'

const network = Chain.Ethereum
const token = 'USDC'
const amount = 1_000_000_000

test(
  'mint',
  async () => {
    const user = new User(privateKey)
    console.log(await user.getAddress())
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
