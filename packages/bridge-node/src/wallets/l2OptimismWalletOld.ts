import * as ethers from 'ethers'
import { bonderPrivateKeyOld, l2OptimismRpcUrl } from 'src/config'

const l2OptimismProvider = new ethers.providers.JsonRpcProvider(
  l2OptimismRpcUrl
)
const L2OptimismWallet = new ethers.Wallet(
  bonderPrivateKeyOld,
  l2OptimismProvider
)

export { l2OptimismProvider }
export default l2OptimismWallet
