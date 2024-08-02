import fs from 'node:fs'
import { ChainSlug, NetworkSlug } from '@hop-protocol/sdk'
import { ConfigManager } from '../ConfigManager.js'
import { providers } from 'ethers'
import { getChain } from '@hop-protocol/sdk'
import { SyncType } from '#constants/index.js'
import { mkdirp } from 'mkdirp'

export type ChainInfo = {
  [key in ChainSlug]?: {
    rpcUrl: string
  }
}

export interface ISharedConfig {
  network: NetworkSlug
  chains: ChainInfo
  dbDir: string
  syncType: SyncType
}

export class SharedConfig extends ConfigManager {
  static network: NetworkSlug
  static chains: ChainInfo
  static dbDir: string
  static syncType: SyncType

  protected static override async init(sharedConfig: ISharedConfig): Promise<void> {
    const { network, chains, dbDir } = sharedConfig
    this.network = network
    this.chains = chains
    this.dbDir = dbDir
    this.syncType = SyncType.Bonder

    // Create DB dir if it doesn't exist
    mkdirp.sync(this.dbDir)
  }

  protected static override async validate(): Promise<void> {
    if (
      !this.network ||
      !this.chains ||
      !this.dbDir ||
      !this.syncType
    ) {
      throw new Error('SharedConfig not yet init')
    }

    if (!Object.values(NetworkSlug).includes(this.network)) {
      throw new Error(`Invalid network value: ${this.network}`)
    }

    for (const [chain, chainInfo] of Object.entries(this.chains)) {
      if (!Object.values(ChainSlug).includes(chain as ChainSlug)) {
        throw new Error(`Invalid chain slug: ${chain}`)
      }

      if (!chainInfo?.rpcUrl || typeof chainInfo.rpcUrl !== 'string') {
        throw new Error(`Invalid or missing RPC_URL for chain: ${chain}`)
      }

      await this.#validateRpcUrl(this.network, chain as ChainSlug, chainInfo.rpcUrl)
    }

    if (!fs.existsSync(this.dbDir)) {
      throw new Error(`Invalid or missing dbDir: ${this.dbDir}`)
    }

    if (!Object.values(SyncType).includes(this.syncType)) {
      throw new Error(`Invalid syncType: ${this.syncType}`)
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
