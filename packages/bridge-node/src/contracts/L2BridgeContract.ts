import * as ethers from 'ethers'
import L2BridgeAbi from 'src/abi/L2Bridge.json'
import { L2BridgeAddress } from 'src/config'
import L2Wallet from 'src/wallets/L2Wallet'

const L2BridgeContract = new ethers.Contract(
  L2BridgeAddress,
  L2BridgeAbi,
  L2Wallet
)

export default L2BridgeContract
