import { KOVAN, XDAI, OPTIMISM, DAI } from 'src/constants'
import { privateKey } from './config'
import { User } from './helpers'

console.log(KOVAN, OPTIMISM, XDAI, DAI)

const network = KOVAN
const token = 'sBTC'
const amount = 10000

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
