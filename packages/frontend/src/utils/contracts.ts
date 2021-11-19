import {
  L1Bridge__factory,
  HopBridgeToken__factory,
  L2AmmWrapper__factory,
  L2Bridge__factory,
} from '@hop-protocol/core/contracts'

export const hopBridgeTokenInterface = HopBridgeToken__factory.createInterface()
export const l1BridgeInterface = L1Bridge__factory.createInterface()
export const l2AmmWrapperInterface = L2AmmWrapper__factory.createInterface()
export const l2BridgeInterface = L2Bridge__factory.createInterface()

export const contractInterfaces = {
  hopBridgeTokenInterface,
  l1BridgeInterface,
  l2AmmWrapperInterface,
  l2BridgeInterface,
}
