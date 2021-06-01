import * as ethers from 'ethers'
import { Hop } from '@hop-protocol/sdk'
import { network as configNetwork } from 'src/config'

import Token from './Token'
import Network from './Network'

// TODO: use sdk instance from app context
const sdk = new Hop(configNetwork)

class User {
  readonly provider: ethers.providers.Web3Provider

  constructor (_provider: ethers.providers.Web3Provider) {
    this.provider = _provider
  }

  signer (): ethers.Signer {
    return this.provider.getSigner()
  }

  async getBalance (token: Token, network: Network): Promise<ethers.BigNumber> {
    const bridge = sdk.bridge(token.symbol.replace('h', ''))
    // TODO: better way and clean up
    const isHop = token.symbol.startsWith('h') || network?.slug?.includes('Hop')
    const _token = isHop ? bridge.hopToken : bridge.token

    // note: remove this when convert page is refactored
    const canonicalSlug = (network: Network) => {
      return network?.slug?.replace('HopBridge', '')
    }
    return _token.connect(this.provider?.getSigner()).balanceOf(canonicalSlug(network))
    // return ethers.BigNumber.from('0')
    // const tokenContract = token.contractForNetwork(network)
    // const userAddress = this.provider.getSigner().getAddress()
    // return tokenContract.balanceOf(userAddress)
  }
}

export default User
