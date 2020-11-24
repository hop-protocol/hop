import * as ethers from 'ethers'

import Token from './Token'
import Network from './Network'

class User {
  provider: ethers.providers.Web3Provider

  constructor (_provider: ethers.providers.Web3Provider) {
    this.provider = _provider
  }

  async getBalance (token: Token, network: Network): Promise<ethers.BigNumber> {
    const tokenContract = token.contractForNetwork(network)
    const userAddress = this.provider.getSigner().getAddress()
    return tokenContract.balanceOf(userAddress)
  }
}

export default User
