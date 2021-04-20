import { privateKey, governancePrivateKey } from './config'
import { User } from './helpers'
// @ts-ignore
import { ETHEREUM, XDAI, OPTIMISM, DAI } from 'src/constants'

const network = ETHEREUM
const token = 'USDC'

test(
  'addBonder',
  async () => {
    const newBonder = new User(privateKey)
    const gov = new User(governancePrivateKey)
    let isBonder = await newBonder.isBonder(network, token)
    expect(isBonder).toBe(false)
    const tx = await gov.addBonder(network, token, await newBonder.getAddress())
    console.log('tx hash:', tx.hash)
    const receipt = await tx.wait()
    expect(receipt.status).toBe(1)
    isBonder = await newBonder.isBonder(network, token)
    expect(isBonder).toBe(true)
  },
  60 * 1000
)
