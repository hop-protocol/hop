import {
  L1Bridge__factory,
  HopBridgeToken__factory,
  L2AmmWrapper__factory,
  L2Bridge__factory,
  Swap__factory,
  ERC20__factory,
  WETH9__factory,
} from '@hop-protocol/core/contracts'
import { Interface } from '@ethersproject/abi'
import { providers, Signer } from 'ethers'
import { ENSToken__factory } from 'src/abis'

export const hopBridgeTokenInterface = HopBridgeToken__factory.createInterface()
export const l1BridgeInterface = L1Bridge__factory.createInterface()
export const l2AmmWrapperInterface = L2AmmWrapper__factory.createInterface()
export const l2BridgeInterface = L2Bridge__factory.createInterface()
export const swapInterface = Swap__factory.createInterface()
export const erc20Interface = ERC20__factory.createInterface()
export const weth9Interface = WETH9__factory.createInterface()

export const ensTokenAddress = '0x5793728958f629894d9b0EB59e3a1B784677d764'

export async function getEnsToken(signerOrProvider: providers.Provider | Signer) {
  if ('getCode' in signerOrProvider) {
    const code = await signerOrProvider.getCode(ensTokenAddress)
    if (code === '0x') {
      throw new Error('No code found at ')
    }
    return ENSToken__factory.connect(ensTokenAddress, signerOrProvider)
  } else {
    const code = await signerOrProvider.provider?.getCode(ensTokenAddress)
    if (code === '0x') {
      throw new Error('No code found at ')
    }
    return ENSToken__factory.connect(ensTokenAddress, signerOrProvider)
  }
}

export const gnosisSafeExecTransactionInterface = new Interface([
  'function execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
])

export const contractInterfaces = {
  hopBridgeTokenInterface,
  l1BridgeInterface,
  l2AmmWrapperInterface,
  l2BridgeInterface,
  swapInterface,
  erc20Interface,
  weth9Interface,
  gnosisSafeExecTransactionInterface,
}
