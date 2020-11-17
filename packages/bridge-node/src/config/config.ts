require('dotenv').config()
import {
  L1RpcUrl,
  L2RpcUrl,
  L1BridgeAddress,
  L2BridgeAddress,
  L1PoolTokenAddress,
  L1MessengerAddress,
  L1MessengerWrapperAddress,
  L2TokenAddress,
  L2MessengerAddress,
  L2UniswapFactory,
  L2UniswapRouter,
  L2CanonicalBridge
} from './base.json'

export const committeePrivateKey = process.env.COMMITTEE_PRIVATE_KEY
export {
  L1RpcUrl,
  L2RpcUrl,
  L1BridgeAddress,
  L2BridgeAddress,
  L1PoolTokenAddress,
  L1MessengerAddress,
  L1MessengerWrapperAddress,
  L2TokenAddress,
  L2MessengerAddress,
  L2UniswapFactory,
  L2UniswapRouter,
  L2CanonicalBridge
}
