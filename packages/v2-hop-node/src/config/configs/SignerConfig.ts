import { ConfigManager } from '../ConfigManager.js'
import { ChainSlug } from '@hop-protocol/sdk'

export type MaxGasPriceGwei = {
  [key in ChainSlug]?: {
    maxGasPriceGwei: number
  }
}

export interface ISignerConfig {
  blocknativeApiKey: string
  bonderPrivateKey: string
  maxGasPriceGwei: MaxGasPriceGwei
  // TODO: Get rid of this
  setLatestNonceOnStart: boolean
}

export class SignerConfig extends ConfigManager {
  static blocknativeApiKey: string
  static bonderPrivateKey: string
  static maxGasPriceGwei: MaxGasPriceGwei
  // TODO: Get rid of this
  static setLatestNonceOnStart: boolean

  protected static override async init(config: ISignerConfig): Promise<void> {
    const { blocknativeApiKey, bonderPrivateKey, maxGasPriceGwei } = config
    this.blocknativeApiKey = blocknativeApiKey
    this.bonderPrivateKey = bonderPrivateKey
    this.maxGasPriceGwei = maxGasPriceGwei

    // TODO: Get rid of this
    this.setLatestNonceOnStart = true
  }

  protected static override async validate(): Promise<void> {
    if (
      !this.blocknativeApiKey ||
      !this.bonderPrivateKey ||
      !this.maxGasPriceGwei
    ) {
      throw new Error('SignerConfig not yet init')
    }

    if (this.blocknativeApiKey.length === 0) {
      throw new Error('Invalid blocknativeApiKey')
    }
    
    if (!this.bonderPrivateKey.startsWith('0x') ||this.bonderPrivateKey.length !== 66) {
      throw new Error('Invalid bonderPrivateKey')
    }

    // TODO: MaxGasPriceGwei for all chains
    // if (this.maxGasPriceGwei <= 0 || this.maxGasPriceGwei > 5_000) {
    //   throw new Error('Invalid maxGasPriceGwei')
    // }
  }
}
