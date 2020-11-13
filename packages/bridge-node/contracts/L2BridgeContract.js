import ethers from 'ethers'
import L2BridgeAbi from '../abi/L2Bridge.json'
import { L2BridgeAddress } from '../config.json'
import { L2Wallet } from '../wallets/L2Wallet'

const L2BridgeContract = new ethers.Contract(
  L2BridgeAddress,
  L2BridgeAbi,
  L2Wallet
)

export default L2BridgeContract
