import { BigNumber, BigNumberish, Contract, Signer, constants, providers } from 'ethers'
import { getProviderFromUrl, rateLimitRetry, networks } from '@hop-protocol/sdk-core'

type Provider = providers.Provider

export type ChainProviders = {
  [key: string]: providers.Provider
}

type BaseConfig = {
  network: string
  signer?: Signer
  gasPriceMultiplier?: number
  chainProviders?: ChainProviders
}

export class Base {
  network: string
  signer: Signer
  gasPriceMultiplier: number = 0

  public chainProviders: ChainProviders = {}

  constructor (config: BaseConfig) {
    if (!config.network) {
      throw new Error('network is required')
    }
    this.network = config.network
    if (config.signer) {
      this.signer = config.signer
    }
    this.gasPriceMultiplier = config.gasPriceMultiplier ?? 0
    this.chainProviders = config.chainProviders || this.getDefaultChainProviders()
  }

  getDefaultChainProviders (): ChainProviders {
    const defaultProviders: ChainProviders = {}
    for (const chainSlug in (networks as any)[this.network]) {
      const item = (networks as any)[this.network][chainSlug]
      defaultProviders[item.networkId] = getProviderFromUrl(item.publicRpcUrl)
    }

    return defaultProviders
  }

  setSigner (signer: Signer): void {
    this.signer = signer
  }

  // Note: this is implemented in subclasses
  isValidChain (chainId: BigNumberish): boolean {
    return true
  }

  setChainProvider (chainId: BigNumberish, provider: Provider): void {
    chainId = chainId.toString()
    if (!this.isValidChain(chainId)) {
      throw new Error(
        `unsupported chain "${chainId}" for network ${this.network}`
      )
    }
    this.chainProviders[chainId] = provider
  }

  setChainProviders (chainProviders: ChainProviders): void {
    for (const chainId in chainProviders) {
      if (!this.isValidChain(chainId)) {
        throw new Error(
          `unsupported chain "${chainId}" for network ${this.network}`
        )
      }
      if (chainProviders[chainId]) {
        this.chainProviders[chainId] = chainProviders[chainId]
      }
    }
  }

  setChainProviderUrls (chainProviders: Record<string, string>): void {
    for (const chainId in chainProviders) {
      if (!this.isValidChain(chainId)) {
        throw new Error(
          `unsupported chain "${chainId}" for network ${this.network}`
        )
      }
      if (chainProviders[chainId]) {
        this.chainProviders[chainId] = getProviderFromUrl(chainProviders[chainId])
      }
    }
  }

  public getProviderForChainId (chainId: BigNumberish): Provider {
    chainId = chainId.toString()
    if (!this.chainProviders[chainId]) {
      throw new Error(`provider not set for chain "${chainId}"`)
    }
    return this.chainProviders[chainId]
  }

  async getContractExists (address: string, provider: Provider): Promise<boolean> {
    if (!address) {
      throw new Error('address is required')
    }

    if (!provider) {
      throw new Error('provider is required')
    }

    const code = await provider.getCode(address)
    if (!code) {
      return false
    }

    return code !== '0x'
  }

  public async getBumpedGasPrice (provider: Provider, percent: number): Promise<BigNumber> {
    const gasPrice = await this.getGasPrice(provider)
    return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
  }

  public async getSignerOrProvider (
    chainId: BigNumberish,
    signer: Signer = this.signer
  ): Promise<Signer | Provider> {
    chainId = chainId.toString()
    const provider = this.getProviderForChainId(chainId)
    if (!signer) {
      return provider
    }
    if (Signer.isSigner(signer)) {
      if (signer.provider) {
        const connectedChainId = (await signer.getChainId()).toString()
        if (connectedChainId !== chainId) {
          if (!signer.provider) {
            return signer.connect(provider)
          }
          return provider
        }
        return signer
      } else {
        return provider
      }
    } else {
      const { chainId: signerChainId } = await (signer as Provider).getNetwork()
      if (signerChainId.toString() !== chainId) {
        return provider
      }
      return signer
    }
  }

  public async txOverrides (sourceChainId: BigNumberish, destinationChainId: BigNumberish): Promise<any> {
    sourceChainId = sourceChainId.toString()
    destinationChainId = destinationChainId.toString()
    const txOptions: any = {}
    const provider = await this.getSignerOrProvider(sourceChainId)
    if (this.gasPriceMultiplier > 0) {
      txOptions.gasPrice = await this.getBumpedGasPrice(
        provider as Provider,
        this.gasPriceMultiplier
      )
    }

    // TODO get min gas price for chain
    const minGasPrice = 0
    if (minGasPrice) {
      const currentGasPrice = await this.getGasPrice(provider)
      const minGasPriceBn = BigNumber.from(minGasPrice)
      if (currentGasPrice.lte(minGasPriceBn)) {
        txOptions.gasPrice = minGasPriceBn
      } else {
        txOptions.gasPrice = currentGasPrice
      }
    }

    // TODO get min gas limit for chain
    const minGasLimit = 0
    if (minGasLimit) {
      txOptions.gasLimit = BigNumber.from(minGasLimit)
    }

    return txOptions
  }

  async estimateGas (provider: providers.Provider, tx: any): Promise<BigNumber> {
    const gasLimit = await provider.estimateGas(tx)
    return gasLimit
  }

  getGasPrice = rateLimitRetry(async (signerOrProvider: Signer | Provider): Promise<BigNumber> => {
    if (!signerOrProvider) {
      throw new Error('expected signer or provider')
    }
    const gasPrice = await signerOrProvider.getGasPrice()
    return gasPrice
  })

  async sendTransaction (transactionRequest: providers.TransactionRequest, chainId: BigNumberish): Promise<any> {
    chainId = chainId.toString()

    if (!transactionRequest.to) {
      throw new Error('tx "to" address is required')
    }

    if (!this.signer.provider) {
      throw new Error('signer provider is required')
    }

    const contractExists = await this.getContractExists(transactionRequest.to, this.signer.provider)
    if (!contractExists) {
      throw new Error(`Contract "${transactionRequest.to}" does not exist on chain "${chainId}"`)
    }

    return this.signer.sendTransaction({ ...transactionRequest, chainId } as any)
  }
}
