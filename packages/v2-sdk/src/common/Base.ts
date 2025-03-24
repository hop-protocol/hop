import { BigNumber, BigNumberish, Signer, constants, providers, utils } from 'ethers'
import { getProviderFromUrl, rateLimitRetry, getNetwork, NetworkSlug, FallbackProvider } from '@hop-protocol/sdk'
import { addresses } from '#addresses/index.js'
import { getChainSlug, getTxHashExplorerUrl, getAddressExplorerUrl, getTokenExplorerUrl, isContractError } from '#utils/index.js'
import { Addresses } from '#addresses/types.js'
import { networks } from '#common/networks.js'
import { ContractFunctionRevertedError, ErrorWithCode } from '#error/index.js'

const { getAddress: checksumAddress } = utils

type Provider = providers.Provider

type SignerOrProvider = Signer | Provider

export type SignersOrProviders = {
  [key: string]: SignerOrProvider
}

export type BaseConfig = {
  network?: string
  gasPriceMultiplier?: number
  signersOrProviders: SignersOrProviders
  contractAddresses?: Addresses
}

export type TxOverrides = {
  nonce?: BigNumberish
  gasLimit?: BigNumberish
  gasPrice?: BigNumberish
  maxPriorityFeePerGas?: BigNumberish
  maxFeePerGas?: BigNumberish
  value?: BigNumberish
  chainId?: BigNumberish
  from?: string
  type?: number
}

export class Base {
  network: string
  gasPriceMultiplier: number = 0
  contractAddresses: Addresses
  l1ChainId: number
  batchBlocks: number = 1000
  // #explorerApiBaseUrl = 'http://localhost:8000'
  #explorerApiBaseUrl = 'https://v2-explorer-api-sepolia.hop.exchange'

  signersOrProviders: SignersOrProviders = {}
  hubChainId: string = '42069'

  constructor (config: BaseConfig) {
    this.gasPriceMultiplier = config.gasPriceMultiplier ?? 0
    this.signersOrProviders = config.signersOrProviders ?? {}

    this.network = config.network ?? this.#deriveNetwork()
    this.contractAddresses = addresses[this.network] ?? {}

    if (config.contractAddresses) {
      this.contractAddresses = config.contractAddresses
    }

    this.l1ChainId = this.network === 'mainnet' ? 1 : 5
  }

  #deriveNetwork (): string {
    const networks = [NetworkSlug.Mainnet, NetworkSlug.Sepolia]

    for (const chainId in this.signersOrProviders) {
      for (const net of networks) {
        const network = getNetwork(net)
        const chain = Object.values(network.chains).find(chain => chain.chainId === chainId)

        if (chain) {
          return net
        }
      }
    }

    throw new Error('could not derive network')
  }

  getContractAddresses () {
    return this.contractAddresses
  }

  setContractAddresses (contractAddresses: Addresses) {
    this.contractAddresses = contractAddresses
  }

  getDefaultProvider (chainId: BigNumberish): providers.Provider {
    return Base.getDefaultProvider(chainId)
  }

  getDefaultProviders (): SignersOrProviders {
    return Base.getDefaultProviders(this.network)
  }

  setProvider (chainId: BigNumberish, provider: Provider | Signer): void {
    chainId = chainId.toString()
    if (!this.utils.isValidChainId(chainId)) {
      return
    }
    this.signersOrProviders[chainId] = provider
  }

  setProviders (signersOrProviders: SignersOrProviders): void {
    for (const chainId in signersOrProviders) {
      if (!this.utils.isValidChainId(chainId)) {
        continue
      }
      this.signersOrProviders[chainId?.toString()] = signersOrProviders[chainId]
    }
  }

  setProviderUrl (chainId: BigNumberish, url: string | string[]): void {
    chainId = chainId.toString()
    if (!this.utils.isValidChainId(chainId)) {
      return
    }
    if (url) {
      this.signersOrProviders[chainId] = getProviderFromUrl(url)
    }
  }

  setProviderUrls (signersOrProviders: Record<string, string | string[]>): void {
    for (const chainId in signersOrProviders) {
      if (!this.utils.isValidChainId(chainId)) {
        continue
      }
      if (signersOrProviders[chainId]) {
        this.signersOrProviders[chainId?.toString()] = getProviderFromUrl(signersOrProviders[chainId])
      }
    }
  }

  getColorForChainId (chainId: BigNumberish): string {
    const network = getNetwork(this.network as NetworkSlug)
    const chainIdStr = chainId.toString()
    const chain = Object.values(network.chains).find(chain => chain.chainId === chainIdStr)

    if (chain) {
      return chain.primaryColor
    }

    return '#aaaaaa'
  }

  getConfigAddress (chainId: BigNumberish, key: string): string {
    if (!chainId) {
      throw new Error('chainId is required')
    }

    const address = (this.contractAddresses as any)?.[chainId?.toString()]?.[key] // TODO: fix type
    return address
  }

  getConfigStartBlock (chainId: BigNumberish): number {
    if (!chainId) {
      throw new Error('chainId is required')
    }

    const startBlock = (this.contractAddresses as any)?.[chainId?.toString()]?.startBlock // TODO: fix type
    return startBlock ?? 0
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

  async getSignerAddress (chainId: BigNumberish): Promise<string | null> {
    const signer = await this.getSigner(chainId)
    if (signer) {
      return signer.getAddress()
    }

    return null
  }

  async getSigner (chainId: BigNumberish): Promise<Signer | null> {
    chainId = chainId.toString()
    let signer = this.signersOrProviders[chainId]

    if (!signer) {
      throw new Error(`getSigner: signer or provider not set for chain "${chainId}"`)
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`invalid chainId "${chainId}"`)
    }

    let isProvider = false
    try {
      isProvider = (signer as any)._isProvider
      if (isProvider) {
        if (typeof (signer as any).getSigner === 'function') {
          //isProvider = false
          //signer = (signer as any).getSigner()
        }
      }
    } catch (err: any) {
      console.warn('getSigner isProvider getSigner error:', err)
      return null
    }

    if (isProvider) {
      return null
    }

    if (signer) {
      signer = this.getEthersWeb3Signer(signer)
    }

    if (signer.provider) {
      const connectedChainId = (await signer.getChainId()).toString()
      if (connectedChainId !== chainId) {
        console.warn('connectedChainId', connectedChainId, 'desiredChainId', chainId)
        console.warn('signer:', signer)
        return null
      }
      return signer
    } else {
      const provider = this.getProvider(chainId)
      if (!provider) {
        throw new Error(`provider for chainId "${chainId?.toString()}"`)
      }

      return signer.connect(provider)
    }
  }

  getProvider(chainId: BigNumberish): Provider | null {
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`invalid chainId "${chainId}"`)
    }

    chainId = chainId.toString()

    const signerOrProvider = this.signersOrProviders[chainId]

    if (!signerOrProvider) {
      throw new Error(`getProvider: signer or provider not set for chain "${chainId}"`)
    }

    if (Signer.isSigner(signerOrProvider)) {
      return (signerOrProvider as Signer).provider ?? null
    }

    return signerOrProvider as Provider
  }

  async getSignerOrProvider (
    chainId: BigNumberish
  ): Promise<Signer | Provider> {
    try {
      const signer = await this.getSigner(chainId)
      if (signer) {
        return signer
      }
    } catch (err: any) {
      console.warn('hopV2Sdk:', err)
    }

    const provider = this.getProvider(chainId)
    if (provider) {
      return provider
    }

    throw new Error(`could not get signer or provider for chain "${chainId}"`)
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

  async sendTransaction (transactionRequest: providers.TransactionRequest, chainId: BigNumberish | undefined = transactionRequest?.chainId, customSigner?: Signer | null): Promise<providers.TransactionResponse> {
    chainId = chainId?.toString()

    if (customSigner) {
      customSigner = this.getEthersWeb3Signer(customSigner)
    }

    if (!chainId) {
      throw new Error('chainId is required in sendTransaction')
    }

    if (!transactionRequest.to) {
      console.warn('transactionRequest:', transactionRequest)
      throw new Error('tx "to" address is required')
    }

    if (!this.utils.isValidAddress(transactionRequest.to)) {
      throw new Error('invalid "to" address')
    }

    let signer = customSigner
    if (!signer) {
      signer = await this.getSigner(chainId)
    }

    if (!signer) {
      console.warn('signersOrProviders', this.signersOrProviders)
      console.warn('customSigner', customSigner)
      throw new Error(`sendTransaction: signer is required, not set for chain "${chainId}"`)
    }

    if (!signer.provider) {
      throw new Error(`sendTransaction: signer provider is required, not set for chain "${chainId}"`)
    }

    await this.utils.switchChain(chainId, signer.provider)

    if (!customSigner) {
      // note: this is to get the correct signer from configured siginersOrProviders object
      signer = await this.getSigner(chainId)
    }

    if (!(Signer.isSigner(signer) && signer.provider)) {
      console.error(signer)
      throw new Error(`signer not connected to required chain "${chainId}"`)
    }

    const contractExists = await this.getContractExists(transactionRequest.to, signer.provider)
    if (!contractExists) {
      throw new Error(`Contract "${transactionRequest.to}" does not exist on chain "${chainId}"`)
    }

    try {
      const tx = await signer.sendTransaction({ ...transactionRequest, chainId: Number(chainId?.toString()) })
      return tx
    } catch (err: unknown) {
      return this.throwError(err) as providers.TransactionResponse
    }
  }

  getSupportedChainIds(): string[] {
    return Object.keys(this.contractAddresses)
  }

  getSupportedTokenSymbols(): string[] {
    const list : Set<string> = new Set<string>([])

    for (const chainId in this.contractAddresses) {
      for (const token in this.contractAddresses[chainId].tokens) {
        list.add(token!)
      }
    }

    return Array.from(list)
  }

  getSupportedTokenSymbolsByChainId(chainId: BigNumberish): string[] {
    const list : Set<string> = new Set<string>([])
    const chainIdStr = chainId?.toString()

    if (this.contractAddresses[chainId?.toString()]) {
      for (const token in this.contractAddresses[chainIdStr].tokens) {
        list.add(token)
      }
    }

    return Array.from(list)
  }

  getTokenAddressByTokenSymbol (chainId: BigNumberish, tokenSymbol: string): string {
    const address = (this.contractAddresses[chainId?.toString()]?.tokens as any)?.[tokenSymbol]?.address
    console.log('hopV2Sdk: getTokenAddressByTokenSymbol', chainId, tokenSymbol, address)
    if (!address) {
      console.log('hopV2Sdk: getTokenAddressByTokenSymbol', this.network, chainId, tokenSymbol, JSON.stringify(this.contractAddresses))
    }
    return address
  }

  getTokenSymbolByTokenAddress (chainId: BigNumberish, tokenAddress: string): string {
    const tokens = (this.contractAddresses[chainId?.toString()]?.tokens as any) || {}
    const tokenSymbol = Object.keys(tokens).find(symbol => tokens[symbol]?.address === tokenAddress)
    if (!tokenSymbol) {
      throw new Error(`tokenSymbol not found for token address ${tokenAddress} on chainId ${chainId?.toString()}`)
    }
    return tokenSymbol
  }

  getChainIdsSupportedByTokenSymbol (tokenSymbol: string): string[] {
    const list : Set<string> = new Set<string>([])

    for (const chainId in this.contractAddresses) {
      for (const token in this.contractAddresses[chainId].tokens) {
        if (token === tokenSymbol) {
          list.add(chainId)
        }
      }
    }

    return Array.from(list)
  }

  get utils() {
    return {
      isValidObject: (obj: any): boolean => {
        return obj instanceof Object && !Array.isArray(obj)
      },

      isValidChainId: (chainId: BigNumberish): boolean => {
        const exists = this.contractAddresses[chainId?.toString()] != null
        if (!exists) {
          console.warn(`hopV2Sdk: chainId "${chainId}" not configured`) // TODO: handle this better
        }
        return true
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
        } catch (err: unknown) {
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

      getChainSlug: (chainId: BigNumberish): string => {
        return getChainSlug(chainId)
      },

      getBumpedGasPrice: async (provider: Provider, percent: number): Promise<BigNumber> => {
        const gasPrice = await this.utils.getGasPrice(provider)
        return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
      },

      estimateGas: async (provider: providers.Provider, tx: providers.TransactionRequest): Promise<BigNumber> => {
        const gasLimit = await provider.estimateGas(tx)
        return gasLimit
      },

      willTransactionFail: async (provider: Provider, tx: providers.TransactionRequest): Promise<boolean> => {
        try {
          await this.utils.estimateGas(provider, tx)
          return false
        } catch (err: unknown) {
          console.error('hopV2Sdk: willTransactionFail error', err)
          return true
        }
      },

      getGasPrice: rateLimitRetry(async (signerOrProvider: Signer | Provider): Promise<BigNumber> => {
        if (!signerOrProvider) {
          throw new Error('expected signer or provider')
        }
        const gasPrice = await signerOrProvider.getGasPrice()
        return gasPrice
      }),

      isContractError: (err: unknown): boolean => {
        return isContractError(err)
      },

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

      getChainInfo: (chainId: BigNumberish): any => {
        const info = networks[this.network]?.[chainId?.toString()]
        const imageUrl = this.utils.getLogoForChainId(chainId)

        return {
          ...info,
          imageUrl
        }
      },

      getLogoForChainSlug: (chainSlug: string): string => {
        return `https://assets.hop.exchange/logos/${chainSlug?.toLowerCase()}.svg`
      },

      getLogoForTokenSymbol: (tokenSymbol: string): string => {
        return `https://assets.hop.exchange/logos/${tokenSymbol?.toLowerCase()}.svg`
      },

      switchChain: async (chainId: BigNumberish, provider: providers.Provider): Promise<void> => {
        chainId = BigNumber.from(chainId).toNumber()

        // Note: chainId must be unpadded hex string
        const chainIdHex = `0x${chainId.toString(16)}`
        try {
          if (!provider) {
            throw new Error('provider or signer is required')
          }

          const connectedChainId = await this.utils.getConnectedChainId(provider)
          if (connectedChainId.toString() === chainId.toString()) {
            return
          }

          await (provider as any).send('wallet_switchEthereumChain', [{ chainId: chainIdHex }]) // TODO: type
        } catch (err: unknown) {
          if ((err as ErrorWithCode).code === 4902) {
            const chains = getNetwork(this.network as NetworkSlug).chains
            const chain = (chains as any)[this.utils.getChainSlug(chainId)]
            if (chain) {
              const nativeCurrency = chain?.nativeTokenSymbol
              await (provider as any).send('wallet_addEthereumChain', [{ // TODO: type
                chainId: chainIdHex,
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
      },

      generateZeroBytes32: () => {
        return '0x' + '0'.repeat(64)
      }
    }
  }

  throwError (err: unknown): unknown {
    if (this.utils.isContractError(err)) {
      throw new ContractFunctionRevertedError((err as Error).message)
    }

    throw err
  }

  async getSignerProviderChainId(chainId: BigNumberish): Promise<BigNumber> {
    const signer = await this.getSigner(chainId)
    if (!signer?.provider) {
      throw new Error('signer has no provider connected, cannot get provider chainId')
    }
    return this.utils.getConnectedChainId(signer.provider)
  }

  static getDefaultProviders (network: string): SignersOrProviders {
    const defaultProviders: SignersOrProviders = {}
    const chains = getNetwork(network as NetworkSlug).chains
    for (const chainSlug in chains) {
      const item = (chains as any)[chainSlug] // TODO: type
      const urls: string[] = [item.publicRpcUrl]
      if (item.fallbackPublicRpcUrls && item.fallbackPublicRpcUrls.length > 0) {
        urls.push(...item.fallbackPublicRpcUrls)
      }

      defaultProviders[item.chainId?.toString()] = FallbackProvider.fromUrls(urls)
    }

    return defaultProviders
  }

  static getDefaultProvider (chainId: BigNumberish): providers.Provider {
    const networks = [NetworkSlug.Mainnet, NetworkSlug.Sepolia]
    const chainIdStr = chainId.toString()

    for (const net of networks) {
      const network = getNetwork(net)
      const chain = Object.values(network.chains).find(chain => chain.chainId === chainIdStr)

      if (chain) {
        const urls: string[] = [chain.publicRpcUrl]
        if (chain.fallbackPublicRpcUrls && chain.fallbackPublicRpcUrls.length > 0) {
          urls.push(...chain.fallbackPublicRpcUrls)
        }

        return FallbackProvider.fromUrls(urls)
      }
    }

    throw new Error(`No default provider found for chainId "${chainIdStr}"`)
  }

  getEthersWeb3Signer(signer: any): Signer {
    if (!Signer.isSigner(signer)) {
      try {
        signer = (new providers.Web3Provider(signer as any, 'any').getSigner()) as any
        console.warn('getEthersWeb3Signer, signer:', signer)
      } catch (err: any) {
        console.log('getEthersWeb3Signer: new Web3Provider error:', err)
      }
    }

    return signer
  }

  getHubChainId(): string {
    return this.hubChainId
  }

  setHubChainId(newChainId: BigNumberish): void {
    this.hubChainId = newChainId.toString()
  }

  getExplorerApiBaseUrl(): string {
    return this.#explorerApiBaseUrl
  }

  setExplorerApiBaseUrl(url: string): void {
    this.#explorerApiBaseUrl = url
  }
}
