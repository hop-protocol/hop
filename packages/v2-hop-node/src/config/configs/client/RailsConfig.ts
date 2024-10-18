import { SignerConfig } from '../../index.js'
import { ConfigManager } from '../../ConfigManager.js'
import { Rails } from '#clients/index.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { RailsGateway } from '#clients/rails/RailsSDKWrapper.js'

export interface IRailsConfig {
  paths: Rails.RailsPath[]
}

export class RailsConfig extends ConfigManager {
  static paths: Rails.RailsPath[]

  protected static override async init(config: IRailsConfig): Promise<void> {
    this.paths = config.paths
  }

  protected static override async validate(): Promise<void> {
    // Validate that the paths are live
    for (const path of this.paths) {
      const pathId = Rails.getPathId(path)
      const provider = getRpcProvider(path.srcChainId)
      const railsGateway = new RailsGateway(path.srcChainId, provider)
      const isLive = await railsGateway.getIsPathIdLive(pathId)
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
