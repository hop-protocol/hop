import { ConfigManager } from '../ConfigManager.js'
import type { ChainSlug } from '@hop-protocol/sdk'

export type MaxGasPriceGwei = {
  [key in ChainSlug]?: number
}

export interface ISignerConfig {
  blocknativeApiKey: string
  bonderPrivateKey: string
  maxGasPriceGwei: MaxGasPriceGwei
}

export class SignerConfig extends ConfigManager {
  static blocknativeApiKey: string
  static bonderPrivateKey: string
  static maxGasPriceGwei: MaxGasPriceGwei

  protected static override async init(config: ISignerConfig): Promise<void> {
    const { blocknativeApiKey, bonderPrivateKey, maxGasPriceGwei } = config
    this.blocknativeApiKey = blocknativeApiKey
    this.bonderPrivateKey = bonderPrivateKey
    this.maxGasPriceGwei = maxGasPriceGwei
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

    for (const chain in this.maxGasPriceGwei) {
      const maxGasPrice = this.maxGasPriceGwei[chain as ChainSlug]
      if (!maxGasPrice) {
        throw new Error(`maxGasPrice for chain ${chain} not set`)
      }

      if (maxGasPrice <= 0 || maxGasPrice > 5000) {
        throw new Error(`Invalid maxGasPrice for chain ${chain}`)
      }
    }
  }
}
