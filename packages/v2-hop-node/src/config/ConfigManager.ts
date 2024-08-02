import type { ISharedConfig } from './configs/SharedConfig.js'
import type { IGasBoostConfig } from './configs/GasBoostConfig.js'

type Configs = ISharedConfig | IGasBoostConfig

export abstract class ConfigManager {
  static #initialized: boolean = false

  static async initializeConfig(customConfig: Configs): Promise<void> {
    if (this.#initialized) {
      throw new Error('ConfigManager already initialized')
    }

    await this.init(customConfig)
    await this.validate()

    this.#initialized = true
  }

  protected static async init(specificConfig: Configs): Promise<void> {
    throw new Error('Init method not implemented.')
  }

  protected static async validate(): Promise<void> {
    throw new Error('Validate method not implemented.')
  }
}
