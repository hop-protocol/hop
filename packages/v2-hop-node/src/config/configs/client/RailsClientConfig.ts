import type { Rails } from '#clients/index.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { validateRequiredKeys } from '../../utils.js'
import { Rails as RailsSDK, getPath } from '@hop-protocol/v2-sdk'

export interface IRailsClientConfig {
  paths: Rails.RailsPath[]
}

export async function validate(config: IRailsClientConfig): Promise<void> {
  const requiredKeys: Array<keyof IRailsClientConfig> = ['paths']
  validateRequiredKeys<IRailsClientConfig>(config, requiredKeys)

  const { paths } = config

  // Validate that the paths are fully live
  for (const _path of paths) {
    const path = getPath(_path)
    const chains = path.getChains()
    const rpcs = chains.map(chain => getRpcProvider(chain.chainId))

    const railsGateway = new RailsSDK(chains, rpcs)
    const isLive = await railsGateway.isPathInitialized(path)
    if (!isLive) {
      throw new Error(`Path is not live: ${path.pathId}`)
    }
  }

  // Validate that the correct rpcs are supplied
  for (const _path of paths) {
    const path = getPath(_path)
    try {
      const chains = path.getChains()
      for (const chain of chains) {
        const provider = getRpcProvider(chain.chainId)
        const retrievedChainId = (await provider.getNetwork()).chainId.toString()
        if (chain.chainId !== retrievedChainId) {
          throw new Error(`ChainId mismatch for path: ${JSON.stringify(path)}`)
        }
      }
    } catch (err) {
      throw new Error(`Failed to validate rpc url: ${err.message}`)
    }
  }
}
