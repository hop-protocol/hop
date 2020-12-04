import * as ethers from 'ethers'
import L2ArbitrumBridgeAbi from 'src/abi/L2ArbitrumBridge.json'
import { L2ArbitrumBridgeAddress } from 'src/config'
import L2ArbitrumWallet from 'src/wallets/L2ArbitrumWallet'

const L2ArbitrumBridgeContract = new ethers.Contract(
  L2ArbitrumBridgeAddress,
  L2ArbitrumBridgeAbi,
  L2ArbitrumWallet
)

export default L2ArbitrumBridgeContract
