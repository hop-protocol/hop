require('dotenv').config()
import { User, checkApproval } from './helpers'
import { wait } from 'src/utils'
import { KOVAN, OPTIMISM, ARBITRUM, XDAI } from 'src/constants'

const privateKey = process.env.TEST_USER_PRIVATE_KEY
const TOKEN = 'DAI'
const AMOUNT = 10000
const l2Network = ARBITRUM

test(
  `convert token to Hop bridge token on ${l2Network}`,
  async () => {
    const user = new User(privateKey)
    let tx = await user.mint(KOVAN, TOKEN, AMOUNT)
    await tx.wait()
    const l1Bridge = user.getHopBridgeContract(KOVAN, TOKEN)
    await checkApproval(user, l2Network, TOKEN, l1Bridge.address)
    const hopBalanceBefore = await user.getHopBalance(l2Network, TOKEN)
    tx = await user.canonicalTokenToHopToken(l2Network, TOKEN, AMOUNT)
    console.log('tx sendToL2:', tx?.hash)
    await tx?.wait()
    await wait(20 * 1000)
    const hopBalanceAfter = await user.getHopBalance(l2Network, TOKEN)
    expect(hopBalanceAfter > hopBalanceBefore).toBe(true)
  },
  300 * 1000
)
