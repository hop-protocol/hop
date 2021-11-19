import {
  L1Bridge__factory,
  HopBridgeToken__factory,
  L2AmmWrapper__factory,
  L2Bridge__factory,
  Swap__factory,
  ERC20__factory,
  WETH9__factory,
} from '@hop-protocol/core/contracts'

export const hopBridgeTokenInterface = HopBridgeToken__factory.createInterface()
export const l1BridgeInterface = L1Bridge__factory.createInterface()
export const l2AmmWrapperInterface = L2AmmWrapper__factory.createInterface()
export const l2BridgeInterface = L2Bridge__factory.createInterface()
export const swapInterface = Swap__factory.createInterface()
export const erc20Interface = ERC20__factory.createInterface()
export const weth9Interface = WETH9__factory.createInterface()

export const contractInterfaces = {
  hopBridgeTokenInterface,
  l1BridgeInterface,
  l2AmmWrapperInterface,
  l2BridgeInterface,
  swapInterface,
  erc20Interface,
  weth9Interface,
}
