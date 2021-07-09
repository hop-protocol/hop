import { Chain } from 'src/constants'
import { User } from './helpers'
import { privateKey } from './config'

const networks = [Chain.xDai, Chain.Optimism]
const token = 'DAI'

describe('code', () => {
  for (const network of networks) {
    it(network, async () => {
      const user = new User(privateKey)
      const bridge = await user.getHopBridgeContract(network, token)
      const wrapperAddress = await bridge.ammWrapper()
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
