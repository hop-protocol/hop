import * as ethers from 'ethers'
import L1BridgeAbi from 'src/abi/L1Bridge.json'
import { L1BridgeAddress } from 'src/config'
import L1Wallet from 'src/wallets/L1Wallet'

const L1BridgeContract = new ethers.Contract(
  L1BridgeAddress,
  L1BridgeAbi,
  L1Wallet
)

export default L1BridgeContract
