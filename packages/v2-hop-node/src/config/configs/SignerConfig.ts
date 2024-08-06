import { SyncType } from '#constants/index.js'
import { ChainSlug, NetworkSlug } from '@hop-protocol/sdk'
import { ConfigManager } from '../ConfigManager.js'
import { providers } from 'ethers'
import { getChain } from '@hop-protocol/sdk'

type ChainInfo = {
  rpcUrl: string
  maxGasPriceGwei: number
  syncType: SyncType
}

type Chains = {
  [key in ChainSlug]?: ChainInfo
}

export interface ISignerConfig {
  network: NetworkSlug
  blocknativeApiKey: string
  bonderPrivateKey: string
  chains: Chains
}

export class SignerConfig extends ConfigManager {
  static network: NetworkSlug
  static blocknativeApiKey: string
  static bonderPrivateKey: string
  static chains: Chains

  protected static override async init(config: ISignerConfig): Promise<void> {
    const { network, blocknativeApiKey, bonderPrivateKey, chains } = config
    this.network = network
    this.blocknativeApiKey = blocknativeApiKey
    this.bonderPrivateKey = bonderPrivateKey
    this.chains = chains
  }

  protected static override async validate(): Promise<void> {
    if (!this.blocknativeApiKey || this.blocknativeApiKey.length === 0) {
      throw new Error('Invalid blocknativeApiKey')
    }

    if (
      !this.bonderPrivateKey ||
      !this.bonderPrivateKey.startsWith('0x') ||
      this.bonderPrivateKey.length !== 66
    ) {
      throw new Error('Invalid bonderPrivateKey')
    }

    // Validate network
    if (!Object.values(NetworkSlug).includes(this.network)) {
      throw new Error(`Invalid network value: ${this.network}`)
    }

    // Validate chains
    for (const [chain, chainInfo] of Object.entries(this.chains)) {
      await this.#validateChainInfo(chain, chainInfo)
    }
  }

  static async #validateChainInfo (chain: string, chainInfo: ChainInfo): Promise<void> {
    if (!Object.values(ChainSlug).includes(chain as ChainSlug)) {
      throw new Error(`Invalid chain slug: ${chain}`)
    }

    // Validate rpcUrl
    if (!chainInfo.rpcUrl || typeof chainInfo.rpcUrl !== 'string') {
      throw new Error(`Invalid or missing RPC_URL for chain: ${chain}`)
    }

    await this.#validateRpcUrl(this.network, chain as ChainSlug, chainInfo.rpcUrl)

    // Validate syncType
    if (!Object.values(SyncType).includes(chainInfo.syncType)) {
      throw new Error(`Invalid syncType: ${chainInfo.syncType}`)
    }

    // Validate maxGasPriceGwei
    const maxGasPrice = chainInfo.maxGasPriceGwei
    if (!maxGasPrice) {
      throw new Error(`maxGasPrice for chain ${chain} not set`)
    }

    if (maxGasPrice <= 0 || maxGasPrice > 5000) {
      throw new Error(`Invalid maxGasPrice for chain ${chain}`)
    }
  }

  static async #validateRpcUrl (network: NetworkSlug, chain: ChainSlug, rpcUrl: string): Promise<void> {
    // Validate the format of the URL is valid.
    // NOTE: If the URL is an IP address, this format check is skipped.
    if (!rpcUrl.match(/^(http|https):\/\//)) {
      throw new Error('RPC_URL must start with http:// or https://')
    }

    // Validate that the chainId of the RPC_URL matches the expected chainId
    try {
      const provider = new providers.JsonRpcProvider(rpcUrl)
      const chainId = (await provider.getNetwork()).chainId
      const expectedChainId = getChain(network, chain).chainId
      if (chainId.toString() !== expectedChainId) {
        throw new Error(`RPC_URL for chain ${chain} does not match expected chainId, expected ${expectedChainId} but got ${chainId}`)
      }
    } catch (err) {
      throw new Error(`Failed to validate rpc url: ${err.message}`)
    }
  }
}
