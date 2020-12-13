import * as ethers from 'ethers'
import L1BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L1_Bridge.sol/L1_Bridge.json'
import { L1BridgeAddress } from 'src/config'
import L1Wallet from 'src/wallets/L1Wallet'

const L1BridgeContract = new ethers.Contract(
  L1BridgeAddress,
  L1BridgeArtifact.abi,
  L1Wallet
)

export default L1BridgeContract
