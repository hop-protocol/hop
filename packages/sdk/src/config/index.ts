import { sdkConfig } from '@hop-protocol/sdk-core/config'
import { addresses as chainAddresses } from '#addresses/index.js'
import { networks as chainNetworks } from '#networks/index.js'

for (const network in chainNetworks) {
  const addresses = (chainAddresses as any)[network].bridges
  const bonders = (chainAddresses as any)[network].bonders
  sdkConfig[network] = {
    ...sdkConfig[network],
    addresses,
    bonders
  }
}

export { sdkConfig }

export {
  goerli, sepolia, mainnet,
  ChainSlug,
  AssetSymbol,
  FinalityState,
  Bps,
  Fees,
  RelayerFeeWei,
  RelayerFeeEnabled,
  BridgeDeprecated,
  TotalStake,
  DefaultSendGasLimit,
  Config,
  Chains,
  sdkMetadata as metadata,
  bondableChains,
  rateLimitMaxRetries,
  rpcTimeoutSeconds,
} from '@hop-protocol/sdk-core/config'
