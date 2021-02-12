import * as ethers from 'ethers'
import { bonderPrivateKeyOld, l2OptimismRpcUrl } from 'src/config'

const L2OptimismProvider = new ethers.providers.JsonRpcProvider(
  l2OptimismRpcUrl
)
const L2OptimismWallet = new ethers.Wallet(
  bonderPrivateKeyOld,
  L2OptimismProvider
)

export { L2OptimismProvider }
export default L2OptimismWallet
