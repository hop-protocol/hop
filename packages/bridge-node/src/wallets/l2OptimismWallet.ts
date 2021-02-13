import * as ethers from 'ethers'
import { bonderPrivateKey, l2OptimismRpcUrl } from 'src/config'

const l2OptimismProvider = new ethers.providers.JsonRpcProvider(
  l2OptimismRpcUrl
)
const l2OptimismWallet = new ethers.Wallet(bonderPrivateKey, l2OptimismProvider)

export { l2OptimismProvider }
export default l2OptimismWallet
