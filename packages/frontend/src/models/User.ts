import { providers, BigNumber, Signer } from 'ethers'
import { Hop, CanonicalToken } from '@hop-protocol/sdk'
import { hopAppNetwork } from 'src/config'

import Token from './Token'
import Network from './Network'

// TODO: use sdk instance from app context
const sdk = new Hop(hopAppNetwork)

class User {
  readonly provider: providers.Web3Provider

  constructor(_provider: providers.Web3Provider) {
    this.provider = _provider
  }

  signer(): Signer {
    return this.provider.getSigner()
  }

  async getBalance(token: Token, network: Network): Promise<BigNumber> {
    const bridge = sdk
      .connect(this.signer())
      .bridge(token.symbol.replace('h', '') as CanonicalToken)
    // TODO: better way and clean up
    const isHop = token.symbol.startsWith('h') || network?.slug?.includes('Hop')
    const _token = isHop
      ? bridge.getL2HopToken(network.slug)
      : bridge.getCanonicalToken(network.slug)

    return _token.connect(this.provider?.getSigner()).balanceOf()
    // return BigNumber.from('0')
    // const tokenContract = token.contractForNetwork(network)
    // const userAddress = this.provider.getSigner().getAddress()
    // return tokenContract.balanceOf(userAddress)
  }
}

export default User
