import { XDAI, OPTIMISM, DAI } from 'src/constants'
import { User } from './helpers'
import { privateKey } from './config'

const networks = [XDAI, OPTIMISM]
const token = DAI

describe('code', () => {
  for (let network of networks) {
    it(network, async () => {
      const user = new User(privateKey)
      const bridge = await user.getHopBridgeContract(network, token)
      const wrapperAddress = await bridge.uniswapWrapper()
      const provider = bridge.provider
      const { chainId } = await provider.getNetwork()
      let code = await provider.getCode(bridge.address)
      expect(code).not.toBe('0x')

      code = await provider.getCode(wrapperAddress)

      console.log('chain id:', chainId.toString())
      console.log('wrapper address:', wrapperAddress)
      console.log('code:', code)

      expect(code).not.toBe('0x')
    })
  }
})
