import * as ethers from 'ethers'
//import l2BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import l2BridgeArtifact from 'src/abi/L2OptimismBridge.json'
import { L2OptimismBridgeAddress } from 'src/config'
import L2OptimismWallet from 'src/wallets/L2OptimismWallet'

const L2OptimismBridgeAbi = l2BridgeArtifact.abi

const L2OptimismBridgeContract = new ethers.Contract(
  L2OptimismBridgeAddress,
  L2OptimismBridgeAbi,
  L2OptimismWallet
)

export default L2OptimismBridgeContract
