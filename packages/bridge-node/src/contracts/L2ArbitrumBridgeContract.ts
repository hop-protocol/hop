import * as ethers from 'ethers'
import l2BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import { L2ArbitrumBridgeAddress } from 'src/config'
import L2ArbitrumWallet from 'src/wallets/L2ArbitrumWallet'

const L2ArbitrumBridgeAbi = l2BridgeArtifact.abi

const L2ArbitrumBridgeContract = new ethers.Contract(
  L2ArbitrumBridgeAddress,
  L2ArbitrumBridgeAbi,
  L2ArbitrumWallet
)

export default L2ArbitrumBridgeContract
