import { TProvider } from '../../src'
import Base, { ChainProviders } from '../../src/Base'

export default class BaseConsumer {
  base: Base

  constructor(network: string, signer: TProvider, chainProviders?: ChainProviders) {
    this.base = new Base(network, signer, chainProviders)
  }

  checkIsValidNetwork() {
    this.base.isValidNetwork('mainnet')
  }

  chainProvider(chain: string) {
    this.base.getChainProvider(chain)
  }
}
