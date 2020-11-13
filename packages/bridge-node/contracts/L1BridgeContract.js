import ethers from 'ethers'
import L1BridgeAbi from '../abi/L1Bridge.json'
import { L1BridgeAddress } from '../config.json'
import { L1Wallet } from '../wallets/L1Wallet'

const L1BridgeContract = new ethers.Contract(
  L1BridgeAddress,
  L1BridgeAbi,
  L1Wallet
)

export default L1BridgeContract
