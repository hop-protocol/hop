import type { ISharedConfig } from './configs/SharedConfig.js'
import type { ISignerConfig } from './configs/SignerConfig.js'

type Configs = ISharedConfig | ISignerConfig

export abstract class ConfigManager {
  protected static initialized: boolean = false

  static async initializeConfig(customConfig: Configs): Promise<void> {
    if (this.initialized) {
      throw new Error('ConfigManager already initialized')
    }

    await this.init(customConfig)
    await this.validate()

    this.initialized = true
  }

  protected static async init(specificConfig: Configs): Promise<void> {
    throw new Error('Init method not implemented.')
  }

  protected static async validate(): Promise<void> {
    throw new Error('Validate method not implemented.')
  }
}
