import { Chain } from 'src/constants'
import { User } from './helpers'
import { bonderPrivateKey } from './config'

const network = Chain.Ethereum
const token = 'DAI'
const amount = 1_000

test(
  'stake',
  async () => {
    const user = new User(bonderPrivateKey)
    let tokenBalanceBefore: number
    if (network === Chain.Ethereum) {
      tokenBalanceBefore = await user.getBalance(network, token)
    } else {
      tokenBalanceBefore = await user.getHopBalance(network, token)
    }
    expect(tokenBalanceBefore).toBeGreaterThanOrEqual(amount)
    const isBonder = await user.isBonder(network, token)
    expect(isBonder).toBe(true)
    const bridge = await user.getHopBridgeContract(network, token)
    await user.checkApproval(network, token, bridge.address)
    const tx = await user.stake(network, token, amount)
    console.log('stake tx hash:', tx.hash)
    const receipt = await tx.wait()
    expect(receipt.status).toBe(1)
  },
  60 * 1000
)
