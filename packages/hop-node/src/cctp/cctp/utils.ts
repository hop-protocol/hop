import { ChainSlug, NetworkSlug, getChainSlug } from '@hop-protocol/sdk'
import { Contract, utils } from 'ethers'
import { config as globalConfig } from '#config/index.js'

export function getAttestationUrl (messageHash: string): string {
  const attestationUrlSubdomain = globalConfig.network === NetworkSlug.Mainnet ? 'iris-api' : 'iris-api-sandbox'
  const baseUrl = `https://${attestationUrlSubdomain}.circle.com/v1/attestations`
  return `${baseUrl}/${messageHash}`
}

// TODO: Use block numbers, not arbitrary time
export const FinalityTimeForChainIdMs: Record<string, Partial<Record<ChainSlug, number>>> = {
  [NetworkSlug.Mainnet]: {
    [ChainSlug.Ethereum]: 30 * 60 * 1000,
    [ChainSlug.Optimism]: 30 * 60 * 1000,
    [ChainSlug.Arbitrum]: 40 * 60 * 1000,
    [ChainSlug.Base]: 30 * 60 * 1000,
    [ChainSlug.Polygon]: 40 * 60 * 1000,
  },
  [NetworkSlug.Sepolia]: {
    [ChainSlug.Ethereum]: 2 * 60 * 1000,
    [ChainSlug.Optimism]: 1 * 60 * 1000,
    [ChainSlug.Arbitrum]: 1 * 60 * 1000,
    [ChainSlug.Base]: 1 * 60 * 1000
  }
}

export function getFinalityTimeFromChainIdMs (chainId: number): number {
  const chainSlug = getChainSlug(chainId.toString())
  return (FinalityTimeForChainIdMs as any)[globalConfig.network][chainSlug]!
}

// Remove all this in favor of the contract instance from the SDK when available
export const MessageTransmitterAddresses: Record<string, Partial<Record<ChainSlug, string>>> = {
  [NetworkSlug.Mainnet]: {
    [ChainSlug.Ethereum]: '0x0a992d191deec32afe36203ad87d7d289a738f81',
    [ChainSlug.Optimism]: '0x4d41f22c5a0e5c74090899e5a8fb597a8842b3e8',
    [ChainSlug.Arbitrum]: '0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca',
    [ChainSlug.Base]: '0xAD09780d193884d503182aD4588450C416D6F9D4',
    [ChainSlug.Polygon]: '0xF3be9355363857F3e001be68856A2f96b4C39Ba9',
  },
  [NetworkSlug.Sepolia]: {
    [ChainSlug.Ethereum]: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    [ChainSlug.Optimism]: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    [ChainSlug.Arbitrum]: '0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872',
    [ChainSlug.Base]: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD'
  }
}

// Remove all this in favor of the contract instance from the SDK when available
export const HopCCTPAddresses : Record<string, Partial<Record<ChainSlug, string>>> = {
  [NetworkSlug.Mainnet]: {
    [ChainSlug.Ethereum]: '0x7e77461CA2a9d82d26FD5e0Da2243BF72eA45747',
    [ChainSlug.Optimism]: '0x469147af8Bde580232BE9DC84Bb4EC84d348De24',
    [ChainSlug.Arbitrum]: '0x6504BFcaB789c35325cA4329f1f41FaC340bf982',
    [ChainSlug.Base]: '0xe7F40BF16AB09f4a6906Ac2CAA4094aD2dA48Cc2',
    [ChainSlug.Polygon]: '0x1CD391bd1D915D189dE162F0F1963C07E60E4CD6'
  },
  [NetworkSlug.Sepolia]: {
    [ChainSlug.Ethereum]: '',
    [ChainSlug.Optimism]: '',
    [ChainSlug.Arbitrum]: '',
    [ChainSlug.Base]: ''
  }
}

// TODO: Get from SDK
export const CCTP_DOMAIN_MAP: Partial<Record<NetworkSlug, Record<number, number>>> = {
  [NetworkSlug.Mainnet]: {
    0: 1, // Ethereum
    2: 10, // Optimism
    3: 42161, // Arbitrum
    6: 8453, // Base
    7: 137, // Polygon PoS
  },
  [NetworkSlug.Sepolia]: {
    0: 11155111, // Ethereum
    2: 11155420, // Optimism
    3: 421614, // Arbitrum
    6: 84532, // Base
  }
}

// Remove all this in favor of the contract instance from the SDK when available
export function getMessageTransmitterContract (chainId: number): Contract {
  const iface = getCCTPMessageTransmitterContractInterface()
  const chainSlug = getChainSlug(chainId.toString())
  return new Contract(
    MessageTransmitterAddresses[globalConfig.network][chainSlug as ChainSlug]!,
    iface
  )
}

// Remove all this in favor of the contract instance from the SDK when available
export function getHopCCTPContract (chainId: number): Contract {
  const iface = getHopCCTPInterface()
  const chainSlug = getChainSlug(chainId.toString())
  return new Contract(
    HopCCTPAddresses[globalConfig.network][chainSlug as ChainSlug]!,
    iface
  )
}

export function getCCTPMessageTransmitterContractInterface (): utils.Interface {
  const abi: string[] = [
    'function receiveMessage(bytes message, bytes attestation)',
    'event MessageReceived(address indexed caller, uint32 sourceDomain, uint64 indexed nonce, bytes32 sender, bytes messageBody)',
    'event MessageSent(bytes message)'
  ]
  return new utils.Interface(abi)
}

export function getHopCCTPInterface (): utils.Interface {
  const abi: string[] = [
    'event CCTPTransferSent(uint64 indexed cctpNonce,uint256 indexed chainId,address indexed recipient,uint256 amount,uint256 bonderFee)'
  ]
  return new utils.Interface(abi)
}