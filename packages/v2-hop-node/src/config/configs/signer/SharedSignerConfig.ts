import { ChainSlug, getChain } from '@hop-protocol/sdk'
import { isValidUrl } from '#utils/isValidUrl.js'
import { SyncType } from '#constants/constants.js'
import { providers } from 'ethers'
import { Config } from '../../index.js'
import { validateRequiredKeys } from '../../utils.js'

type ChainInfo = {
  rpcUrl: string
  maxGasPriceGwei: number
  syncType: SyncType
}

export type Chains = {
  [key in ChainSlug]?: ChainInfo
}

export interface ISharedSignerConfig {
  chains: Chains
  blocknativeApiKey: string
  bonderPrivateKey: string
}

export async function validate(config: ISharedSignerConfig): Promise<void> {
  const requiredKeys: Array<keyof ISharedSignerConfig> = ['chains', 'blocknativeApiKey', 'bonderPrivateKey']
  validateRequiredKeys<ISharedSignerConfig>(config, requiredKeys)

  const { chains, bonderPrivateKey } = config

  for (const [chain, chainInfo] of Object.entries(chains)) {
    await validateChainInfo(chain, chainInfo)
  }

  if (
    !bonderPrivateKey.startsWith('0x') ||
    bonderPrivateKey.length !== 66
  ) {
    throw new Error('Invalid bonderPrivateKey')
  }
}

async function validateChainInfo (chain: string, chainInfo: ChainInfo): Promise<void> {
  const requiredKeys: Array<keyof ChainInfo> = ['rpcUrl', 'maxGasPriceGwei', 'syncType']
  validateRequiredKeys<ChainInfo>(chainInfo, requiredKeys)

  const { rpcUrl, maxGasPriceGwei, syncType } = chainInfo

  if (!Object.values(ChainSlug).includes(chain as ChainSlug)) {
    throw new Error(`Invalid chain slug: ${chain}`)
  }

  // Validate rpcUrl
  await validateRpcUrl(chain as ChainSlug, rpcUrl)

  // Validate syncType
  if (!Object.values(SyncType).includes(syncType)) {
    throw new Error(`Invalid syncType: ${syncType}`)
  }

  if (maxGasPriceGwei <= 0 || maxGasPriceGwei > 5000) {
    throw new Error(`Invalid maxGasPrice for chain ${chain}`)
  }
}

async function validateRpcUrl (chain: ChainSlug, rpcUrl: string): Promise<void> {
  // Validate the format of the URL is valid.
  // NOTE: If the URL is an IP address, format check is skipped.
  if (!isValidUrl(rpcUrl)) {
    throw new Error('Invalid RPC_URL')
  }

  // Validate that the chainId of the RPC_URL matches the expected chainId
  try {
    const provider = new providers.JsonRpcProvider(rpcUrl)
    const chainId = (await provider.getNetwork()).chainId
    const expectedChainId = getChain(Config.GlobalConfig.options.network, chain).chainId
    if (chainId.toString() !== expectedChainId) {
      throw new Error(`RPC_URL for chain ${chain} does not match expected chainId, expected ${expectedChainId} but got ${chainId}`)
    }
  } catch (err) {
    throw new Error(`Failed to validate rpc url: ${err.message}`)
  }
}
