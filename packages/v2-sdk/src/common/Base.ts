import { BigNumber, BigNumberish, Signer, constants, providers, utils } from 'ethers'
import { getProviderFromUrl, rateLimitRetry, getNetwork, NetworkSlug } from '@hop-protocol/sdk'
import { addresses } from '#addresses/index.js'
import { chainSlugMap, getTxHashExplorerUrl, getAddressExplorerUrl, getTokenExplorerUrl } from '#utils/index.js'
import { Addresses } from '#addresses/types.js'

const { getAddress: checksumAddress } = utils

type Provider = providers.Provider

export type TxOverrides = {
  gasLimit?: BigNumber
  gasPrice?: BigNumber
  nonce?: BigNumber
  chainId?: BigNumber
}

export type ChainProviders = {
  [key: string]: providers.Provider
}

export type BaseConfig = {
  network: string
  signer?: Signer
  gasPriceMultiplier?: number
  chainProviders?: ChainProviders
  contractAddresses?: Addresses
}

export class Base {
  network: string
  signer: Signer
  gasPriceMultiplier: number = 0
  contractAddresses: Addresses
  l1ChainId: number
  batchBlocks: number = 1000

  chainProviders: ChainProviders = {}

  constructor (config: BaseConfig) {
    if (!config.network) {
      throw new Error('network is required')
    }
    this.network = config.network
    if (config.signer) {
      this.signer = config.signer
      if (!Signer.isSigner(this.signer)) {
        this.signer = new providers.Web3Provider(this.signer, 'any').getSigner()
      }
    }
    this.gasPriceMultiplier = config.gasPriceMultiplier ?? 0
    this.chainProviders = config.chainProviders ?? this.getDefaultChainRpcProviders()

    this.contractAddresses = addresses[this.network] ?? {}

    if (config.contractAddresses) {
      this.contractAddresses = config.contractAddresses
    }

    this.l1ChainId = this.network === 'mainnet' ? 1 : 5
  }

  getContractAddresses () {
    return this.contractAddresses
  }

  setContractAddresses (contractAddresses: Addresses) {
    this.contractAddresses = contractAddresses
  }

  getDefaultChainRpcProvider (chainId: BigNumberish): providers.Provider {
    const network = getNetwork(this.network as NetworkSlug)
    const chainIdStr = chainId.toString()
    const chain = Object.values(network.chains).find(chain => chain.chainId === chainIdStr)

    if (chain) {
      return getProviderFromUrl(chain.publicRpcUrl)
    }

    throw new Error(`No default provider found for chainId "${chainIdStr}"`)
  }

  getDefaultChainRpcProviders (): ChainProviders {
    const defaultProviders: ChainProviders = {}
    const chains = getNetwork(this.network as NetworkSlug).chains
    for (const chainSlug in chains) {
      const item = (chains as any)[chainSlug] // TODO: type
      defaultProviders[item.chainId?.toString()] = getProviderFromUrl(item.publicRpcUrl)
    }

    return defaultProviders
  }

  connect (signer: Signer): Base {
    this.signer = signer
    return this
  }

  setChainRpcProvider (chainId: BigNumberish, provider: Provider): void {
    chainId = chainId.toString()
    if (!this.utils.isValidChainId(chainId)) {
      return
    }
    this.chainProviders[chainId] = provider
  }

  setChainRpcProviders (chainProviders: ChainProviders): void {
    for (const chainId in chainProviders) {
      if (!this.utils.isValidChainId(chainId)) {
        continue
      }
      this.chainProviders[chainId?.toString()] = chainProviders[chainId]
    }
  }

  setChainRpcProviderUrl (chainId: BigNumberish, url: string | string[]): void {
    chainId = chainId.toString()
    if (!this.utils.isValidChainId(chainId)) {
      return
    }
    if (url) {
      this.chainProviders[chainId] = getProviderFromUrl(url)
    }
  }

  setChainRpcProviderUrls (chainProviders: Record<string, string | string[]>): void {
    for (const chainId in chainProviders) {
      if (!this.utils.isValidChainId(chainId)) {
        continue
      }
      if (chainProviders[chainId]) {
        this.chainProviders[chainId?.toString()] = getProviderFromUrl(chainProviders[chainId])
      }
    }
  }

  getConfigAddress (chainId: BigNumberish, key: string): string {
    if (!chainId) {
      throw new Error('chainId is required')
    }

    const address = (this.contractAddresses as any)?.[chainId?.toString()]?.[key] // TODO: fix type
    return address
  }

  #getConfigStartBlock (chainId: BigNumberish): number {
    if (!chainId) {
      throw new Error('chainId is required')
    }

    const startBlock = (this.contractAddresses as any)?.[chainId?.toString()]?.startBlock // TODO: fix type
    return startBlock ?? 0
  }

  getRpcProviderForChainId (chainId: BigNumberish): Provider {
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

    if (!this.utils.isValidAddress(address)) {
      throw new Error('invalid address')
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

  getSigner (): Signer | null {
    return this.signer ?? null
  }

  async getSignerAddress (): Promise<string | null> {
    if (this.signer) {
      return this.signer.getAddress()
    }

    return null
  }

  async getSignerOrProvider (
    chainId: BigNumberish,
    signer: Signer = this.signer
  ): Promise<Signer | Provider> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`invalid chainId "${chainId}"`)
    }

    chainId = chainId.toString()
    const provider = this.getRpcProviderForChainId(chainId)
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

  async getTxOverrides (fromChainId: BigNumberish, toChainId: BigNumberish): Promise<TxOverrides> {
    fromChainId = fromChainId.toString()
    toChainId = toChainId.toString()
    const txOptions: TxOverrides = {}
    const provider = await this.getSignerOrProvider(fromChainId)
    if (this.gasPriceMultiplier > 0) {
      txOptions.gasPrice = await this.utils.getBumpedGasPrice(
        provider as Provider,
        this.gasPriceMultiplier
      )
    }

    // TODO get min gas price for chain
    const minGasPrice = 0
    if (minGasPrice) {
      const currentGasPrice = await this.utils.getGasPrice(provider)
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

  async sendTransaction (transactionRequest: providers.TransactionRequest, chainId: BigNumberish | undefined = transactionRequest?.chainId): Promise<providers.TransactionResponse> {
    chainId = chainId?.toString()

    if (!chainId) {
      throw new Error('chainId is required in sendTransaction')
    }

    if (!transactionRequest.to) {
      throw new Error('tx "to" address is required')
    }

    if (!this.utils.isValidAddress(transactionRequest.to)) {
      throw new Error('invalid "to" address')
    }

    if (!this.signer.provider) {
      throw new Error('signer provider is required')
    }

    if (!this.signer) {
      throw new Error('signer is required')
    }

    await this.utils.switchChain(chainId, this.signer.provider)

    const signer = await this.getSignerOrProvider(chainId)
    if (!(Signer.isSigner(signer) && signer.provider)) {
      throw new Error(`signer not connected to required chain "${chainId}"`)
    }

    const contractExists = await this.getContractExists(transactionRequest.to, signer.provider)
    if (!contractExists) {
      throw new Error(`Contract "${transactionRequest.to}" does not exist on chain "${chainId}"`)
    }

    return signer.sendTransaction({ ...transactionRequest, chainId: Number(chainId?.toString()) })
  }

  getSupportedChainIds(): string[] {
    return Object.keys(this.contractAddresses)
  }

  get utils() {
    return {
      isValidObject: (obj: any): boolean => {
        return obj instanceof Object && !Array.isArray(obj)
      },

      isValidChainId: (chainId: BigNumberish): boolean => {
        return this.contractAddresses[chainId?.toString()] != null
      },

      isValidBytes32: (hash: string): boolean => {
        if (typeof hash !== 'string') {
          return false
        }

        const hexPattern = /^0x[0-9a-fA-F]{64}$/
        return hexPattern.test(hash)
      },

      isValidTxHash: (txHash: string): boolean => {
        return this.utils.isValidBytes32(txHash)
      },

      isValidBytes: (bytes: string): boolean => {
        if (typeof bytes !== 'string') {
          return false
        }

        const hexPattern = /^0x[0-9a-fA-F]*$/
        return hexPattern.test(bytes)
      },

      isValidAddress: (address: string): boolean => {
        try {
          address = checksumAddress(address)
          if (address === constants.AddressZero) {
            return false
          }
          return true
        } catch (err) {
          return false
        }
      },

      isValidFilterBlock: (blockTag: string | number): boolean => {
        return blockTag === 'latest' || blockTag === 'pending' || blockTag === 'earliest' || Number(blockTag) >= 0
      },

      isValidNumericValue: (value: BigNumberish | BigNumber | bigint | number | string | object | null): boolean => {
        if (BigNumber.isBigNumber(value)) {
          return true
        }

        return !isNaN(value as number)
      },

      getChainSlug: (chainId: BigNumberish) => {
        const chainSlug = chainSlugMap[chainId.toString()]
        if (!chainSlug) {
          throw new Error(`Invalid chain: ${chainId}`)
        }
        return chainSlug
      },

      getBumpedGasPrice: async (provider: Provider, percent: number): Promise<BigNumber> => {
        const gasPrice = await this.utils.getGasPrice(provider)
        return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
      },

      estimateGas: async (provider: providers.Provider, tx: providers.TransactionRequest): Promise<BigNumber> => {
        const gasLimit = await provider.estimateGas(tx)
        return gasLimit
      },

      getGasPrice: rateLimitRetry(async (signerOrProvider: Signer | Provider): Promise<BigNumber> => {
        if (!signerOrProvider) {
          throw new Error('expected signer or provider')
        }
        const gasPrice = await signerOrProvider.getGasPrice()
        return gasPrice
      }),

      getConnectedChainId: async (provider: Provider): Promise<BigNumber> => {
        const network = await provider.getNetwork()
        return BigNumber.from(network.chainId)
      },

      getTransactionHashExplorerUrl: (txHash: string, chainId: BigNumberish): string => {
        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`invalid chainId "${chainId}"`)
        }
        if (!this.utils.isValidTxHash(txHash)) {
          throw new Error(`invalid transaction hash "${txHash}"`)
        }
        return getTxHashExplorerUrl(this.network, chainId?.toString(), txHash)
      },

      getAddressExplorerUrl: (address: string, chainId: BigNumberish): string => {
        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`invalid chainId "${chainId}"`)
        }
        if (!this.utils.isValidAddress(address)) {
          throw new Error(`invalid address "${address}"`)
        }
        return getAddressExplorerUrl(this.network, chainId?.toString(), address)
      },

      getTokenExplorerUrl: (address: string, chainId: BigNumberish): string => {
        if (!this.utils.isValidChainId(chainId)) {
          throw new Error(`invalid chainId "${chainId}"`)
        }
        if (!this.utils.isValidAddress(address)) {
          throw new Error(`invalid address "${address}"`)
        }
        return getTokenExplorerUrl(this.network, chainId?.toString(), address)
      },

      getLogoForChainId: (chainId: BigNumberish): string => {
        const chainSlug = this.utils.getChainSlug(chainId)
        return this.utils.getLogoForChainSlug(chainSlug)
      },

      getLogoForChainSlug: (chainSlug: string): string => {
        return `https://assets.hop.exchange/logos/${chainSlug?.toLowerCase()}.svg`
      },

      switchChain: async (chainId: BigNumberish, provider: providers.Provider): Promise<void> => {
        chainId = BigNumber.from(chainId)
        try {
          if (!provider) {
            throw new Error('provider or signer is required')
          }

          const connectedChainId = await this.utils.getConnectedChainId(provider)
          if (connectedChainId.toString() === chainId.toString()) {
            return
          }

          await (provider as any).send('wallet_switchEthereumChain', [{ chainId: chainId.toHexString() }]) // TODO: type
        } catch (err) {
          if (err.code === 4902) {
            const chains = getNetwork(this.network as NetworkSlug).chains
            const chain = (chains as any)[this.utils.getChainSlug(chainId)]
            if (chain) {
              const nativeCurrency = chain?.nativeTokenSymbol
              await (provider as any).send('wallet_addEthereumChain', [{ // TODO: type
                chainId: chainId.toHexString(),
                chainName: this.utils.getChainSlug(chainId),
                nativeCurrency: {
                  name: nativeCurrency,
                  symbol: nativeCurrency,
                  decimals: 18
                },
                rpcUrls: [chain.publicRpcUrl],
                blockExplorerUrls: chain.explorerUrls
              }])
            } else {
              throw err
            }
          } else {
            throw err
          }
        }
      }
    }
  }
}
