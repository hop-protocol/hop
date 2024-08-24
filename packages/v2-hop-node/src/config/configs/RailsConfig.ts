import { SignerConfig } from '../index.js'
import { ConfigManager } from '../ConfigManager.js'
import { RailsSDK } from '#rails/RailsSDK.js'
import type { RailsPath } from '#rails/types.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'

export interface IRailsConfig {
  paths: RailsPath[]
}

export class RailsConfig extends ConfigManager {
  static paths: RailsPath[]

  protected static override async init(config: IRailsConfig): Promise<void> {
    this.paths = config.paths
  }

  protected static override async validate(): Promise<void> {
    // Validate that the paths are live
    for (const path of this.paths) {
      const pathId = RailsSDK.getPathId(path)
      const provider = getRpcProvider(path.srcChainId)
      // TODO: add connect when impl
      const isLive = await RailsSDK/*.connect(provider)*/.isPathLive(pathId)
      if (!isLive) {
        throw new Error(`Path is not live: ${pathId}`)
      }
    }

    // Validate that the correct rpcs are supplied
    const network = SignerConfig.network
    for (const path of this.paths) {
      try {
        const provider = getRpcProvider(path.srcChainId)
        const chainId = (await provider.getNetwork()).chainId.toString()
        const expectedChainId = path.srcChainId
        if (chainId !== expectedChainId) {
          throw new Error(`ChainId mismatch for path: ${JSON.stringify(path)}`)
        }
      } catch (err) {
        throw new Error(`Failed to validate rpc url: ${err.message}`)
      }
    }
  }
}
