import { Chain } from 'src/constants'
import { User } from './helpers'
import { governancePrivateKey, privateKey } from './config'
import { wait } from 'src/utils'

const network = Chain.Optimism
const token = 'DAI'

test(
  'addBonder',
  async () => {
    const newBonder = new User(privateKey)
    const gov = new User(governancePrivateKey)
    console.log('gov address:', await gov.getAddress())
    console.log('new bonder address:', await newBonder.getAddress())
    // let isGovernance = await gov.isGovernance(Chain.Ethereum, token)
    // expect(isGovernance).toBe(true)
    let isBonder = await newBonder.isBonder(network, token)
    // expect(isBonder).toBe(false)
    // const tx = await gov.addBonder(Chain.Ethereum, token, await newBonder.getAddress())
    const tx = await gov.addBonder(network, token, await newBonder.getAddress())
    console.log('tx hash:', tx.hash)
    const receipt = await tx.wait()
    expect(receipt.status).toBe(1)
    // wait for L2 to receive update
    await wait(60 * 1000)
    isBonder = await newBonder.isBonder(network, token)
    expect(isBonder).toBe(true)
  },
  300 * 1000
)
