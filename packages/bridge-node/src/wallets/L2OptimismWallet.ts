import * as ethers from 'ethers'
import { bonderPrivateKey, L2OptimismRpcUrl } from 'src/config'

const L2OptimismProvider = new ethers.providers.JsonRpcProvider(L2OptimismRpcUrl)
const L2OptimismWallet = new ethers.Wallet(bonderPrivateKey, L2OptimismProvider)

export { L2OptimismProvider }
export default L2OptimismWallet
