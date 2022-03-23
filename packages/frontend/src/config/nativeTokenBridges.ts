import {
  ArbitrumInbox__factory,
  ArbitrumL1ERC20Bridge__factory,
  L1ArbitrumDaiGateway__factory,
  L1OptimismDaiTokenBridge__factory,
  L1OptimismTokenBridge__factory,
  L1PolygonPlasmaBridgeDepositManager__factory,
  L1PolygonPosRootChainManager__factory,
  L1XDaiForeignOmniBridge__factory,
  L1XDaiWETHOmnibridgeRouter__factory,
} from '@hop-protocol/core/contracts'

export const nativeTokenBridges = {
  gnosis: {
    ETH: L1XDaiWETHOmnibridgeRouter__factory.createInterface(), // wrapAndRelayTokens(address, bytes)
    USDC: L1XDaiForeignOmniBridge__factory.createInterface(), // relayTokens(address, address, uint256)
    DAI: L1XDaiWETHOmnibridgeRouter__factory.createInterface(), // relayTokens(address, uint256)
  },
  polygon: {
    ETH: L1PolygonPosRootChainManager__factory.createInterface(), // depositEtherFor(address)
    USDC: L1PolygonPosRootChainManager__factory.createInterface(), // depositFor(address, address, BigNumberish)
    MATIC: L1PolygonPlasmaBridgeDepositManager__factory.createInterface(), // depositERC20ForUser(address, address, BigNumberish)
  },
  arbitrum: {
    ETH: ArbitrumInbox__factory.createInterface(), // depositEth
    USDC: ArbitrumL1ERC20Bridge__factory.createInterface(), // deposit
    DAI: L1ArbitrumDaiGateway__factory.createInterface(), // outboundTransfer
  },
  optimism: {
    ETH: L1OptimismTokenBridge__factory.createInterface(), // deposit(address, address, address, BigNumberish)
    USDC: L1OptimismTokenBridge__factory.createInterface(), // deposit(address, address, address, BigNumberish)
    DAI: L1OptimismDaiTokenBridge__factory.createInterface(), // depositERC20(address, address, BigNumberish, BigNumberish, BytesLike)
  },
}

console.log(`nativeTokenBridges:`, nativeTokenBridges)
