require('dotenv').config()
import * as config from './default.json'

export const bonderPrivateKey =
  process.env.BONDER_PRIVATE_KEY || process.env.COMMITTEE_PRIVATE_KEY
export const L1EthRpcUrl = process.env.L1_ETH_RPC_URL || config.L1EthRpcUrl
export const L2ArbitrumRpcUrl =
  process.env.L2_ARBITRUM_RPC_URL || config.L2ArbitrumRpcUrl
export const L2OptimismRpcUrl =
  process.env.L2_OPTIMISM_RPC_URL || config.L2OptimismRpcUrl
export const L1BridgeAddress =
  process.env.L1_BRIDGE_ADDRESS || config.L1BridgeAddress
export const L2ArbitrumBridgeAddress =
  process.env.L2_ARBITRUM_BRIDGE_ADDRESS || config.L2ArbitrumBridgeAddress
export const L2OptimismBridgeAddress =
  process.env.L2_OPTIMISM_BRIDGE_ADDRESS || config.L2OptimismBridgeAddress
export const L1DaiAddress = process.env.L1_DAI_ADDRESS || config.L1DaiAddress
export const L1MessengerAddress =
  process.env.L1_MESSENGER_ADDRESS || config.L1MessengerAddress
export const L1MessengerWrapperAddress =
  process.env.L1_MESSENGER_WRAPPER_ADDRESS || config.L1MessengerWrapperAddress
export const L2ArbitrumTokenAddress =
  process.env.L2_ARBITRUM_TOKEN_ADDRESS || config.L2ArbitrumTokenAddress
export const L2ArbitrumMessengerAddress =
  process.env.L2_ARBITRUM_MESSENGER_ADDRESS || config.L2ArbitrumMessengerAddress
export const L2ArbitrumUniswapFactory =
  process.env.L2_ARBITRUM_UNISWAP_FACTORY || config.L2ArbitrumUniswapFactory
export const L2ArbitrumUniswapRouter =
  process.env.L2_ARBITRUM_UNISWAP_ROUTER || config.L2ArbitrumUniswapRouter
export const L2ArbitrumCanonicalBridge =
  process.env.L2_ARBITRUM_CANONICAL_BRIDGE || config.L2ArbitrumCanonicalBridge

export const L2OptimismTokenAddress =
  '0x57eaeE3D9C99b93D8FD1b50EF274579bFEC8e14B'
export const L2OptimismUniswapRouter =
  '0x3C67B82D67B4f31A54C0A516dE8d3e93D010EDb3'
export const L2OptimismUniswapFactory =
  '0x3e4CFaa8730092552d9425575E49bB542e329981'
