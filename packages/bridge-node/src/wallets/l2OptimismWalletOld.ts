import * as ethers from 'ethers'
import { bonderPrivateKeyOld } from 'src/config'
import { getRpcUrl } from 'src/utils'

const rpcUrl = getRpcUrl('optimism')
const l2OptimismProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
const L2OptimismWallet = new ethers.Wallet(
  bonderPrivateKeyOld,
  l2OptimismProvider
)

export { l2OptimismProvider }
export default l2OptimismWallet
