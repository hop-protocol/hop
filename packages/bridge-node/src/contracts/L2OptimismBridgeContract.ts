import * as ethers from 'ethers'
import L2BridgeAbi from 'src/abi/L2Bridge.json'
import { L2OptimismBridgeAddress } from 'src/config'
import L2OptimismWallet from 'src/wallets/L2OptimismWallet'

const L2OptimismBridgeContract = new ethers.Contract(
  L2OptimismBridgeAddress,
  L2BridgeAbi,
  L2OptimismWallet
)

export default L2OptimismBridgeContract
