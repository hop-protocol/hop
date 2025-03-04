import { Rails } from '#clients/index.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { RailsGateway } from '#clients/rails/RailsSDKWrapper.js'
import { validateRequiredKeys } from '../../utils.js'

export interface IRailsClientConfig {
  paths: Rails.RailsPath[]
}

export async function validate(config: IRailsClientConfig): Promise<void> {
  const requiredKeys: Array<keyof IRailsClientConfig> = ['paths']
  validateRequiredKeys<IRailsClientConfig>(config, requiredKeys)

  const { paths } = config

  // Validate that the paths are fully live
  for (const path of paths) {
    const pathId = Rails.getPathId(path)

    const chainIds = [path.chainId, path.counterpartChainId]
    for (const chainId of chainIds) {
      const provider = getRpcProvider(chainId)
      const railsGateway = new RailsGateway(chainId, provider)
      // const isLive = await railsGateway.getIsPathIdLive(pathId)
      // if (!isLive) {
      //   throw new Error(`Path is not live: ${pathId}`)
      // }
    }
  }

  // Validate that the correct rpcs are supplied
  for (const path of paths) {
    try {
      const chainIds = [path.chainId, path.counterpartChainId]
      for (const chainId of chainIds) {
        const provider = getRpcProvider(chainId)
        const retrievedChainId = (await provider.getNetwork()).chainId.toString()
        if (chainId !== retrievedChainId) {
          throw new Error(`ChainId mismatch for path: ${JSON.stringify(path)}`)
        }
      }
    } catch (err) {
      throw new Error(`Failed to validate rpc url: ${err.message}`)
    }
  }
}
