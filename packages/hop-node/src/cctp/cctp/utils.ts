import chainIdToSlug from 'src/utils/chainIdToSlug'
import { Chain, Network } from 'src/constants'
import { Contract } from 'ethers' 
import { config as globalConfig } from 'src/config'

export function getAttestationUrl (messageHash: string): string {
  const attestationUrlSubdomain = globalConfig.network === Network.Mainnet ? 'iris-api' : 'iris-api-sandbox'
  const baseUrl = `https://${attestationUrlSubdomain}.circle.com/v1/attestations`
  return `${baseUrl}/${messageHash}`
}


// Remove all this in favor of the contract instance from the SDK when available
export const MessageTransmitterAddresses: Record<string, Partial<Record<Chain, string>>> = {
  [Network.Mainnet]: {
    [Chain.Ethereum]: '0x0a992d191deec32afe36203ad87d7d289a738f81',
    [Chain.Optimism]: '0x4d41f22c5a0e5c74090899e5a8fb597a8842b3e8',
    [Chain.Arbitrum]: '0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca',
    [Chain.Base]: '0xAD09780d193884d503182aD4588450C416D6F9D4',
    [Chain.Polygon]: '0xF3be9355363857F3e001be68856A2f96b4C39Ba9',
  },
  [Network.Sepolia]: {
    [Chain.Ethereum]: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    [Chain.Optimism]: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    [Chain.Arbitrum]: '0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872',
    [Chain.Base]: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD'
  }
}

// Remove all this in favor of the contract instance from the SDK when available
export const TokenMessengerAddresses: Record<string, Partial<Record<Chain, string>>> = {
  [Network.Mainnet]: {
    [Chain.Ethereum]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    [Chain.Optimism]: '0x2B4069517957735bE00ceE0fadAE88a26365528f',
    [Chain.Arbitrum]: '0x19330d10D9Cc8751218eaf51E8885D058642E08A',
    [Chain.Base]: '0x1682Ae6375C4E4A97e4B583BC394c861A46D8962',
    [Chain.Polygon]: '0x9daF8c91AEFAE50b9c0E69629D3F6Ca40cA3B3FE'
  },
  [Network.Sepolia]: {
    [Chain.Ethereum]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    [Chain.Optimism]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    [Chain.Arbitrum]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    [Chain.Base]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5'
  }
}

// TODO: Get from SDK
export const CCTP_DOMAIN_MAP: Partial<Record<Network, Record<number, number>>> = {
  [Network.Mainnet]: {
    0: 1, // Ethereum
    2: 10, // Optimism
    3: 42161, // Arbitrum
    6: 8453, // Base
    7: 137, // Polygon PoS
  },
  [Network.Sepolia]: {
    0: 11155111, // Ethereum
    2: 11155420, // Optimism
    3: 421614, // Arbitrum
    6: 84532, // Base
  }
}

// Remove all this in favor of the contract instance from the SDK when available
export function getMessageTransmitterContract (chainId: number): Contract {
  const messageTransmitterABI: string[] = [
    'function version() external view returns (uint32)',
    'function receiveMessage(bytes message, bytes attestation)',
    'event MessageReceived(address indexed caller, uint32 sourceDomain, uint64 indexed nonce, bytes32 sender, bytes messageBody)'
  ]
  const chainSlug = chainIdToSlug(chainId)
  return new Contract(
    MessageTransmitterAddresses[globalConfig.network][chainSlug]!,
    messageTransmitterABI
  )
}

// Remove all this in favor of the contract instance from the SDK when available
export function getTokenMessengerContract (chainId: number): Contract {
  const tokenMessengerAbi: string[] = [
    'event DepositForBurn(uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)'
  ]
  const chainSlug = chainIdToSlug(chainId)
  return new Contract(
    TokenMessengerAddresses[globalConfig.network][chainSlug]!,
    tokenMessengerAbi
  )
}