import * as ethers from 'ethers'
import { bonderPrivateKey } from 'src/config'
import { getRpcUrl } from 'src/utils'

const rpcUrl = getRpcUrl('optimism')
const l2OptimismProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
const l2OptimismWallet = new ethers.Wallet(bonderPrivateKey, l2OptimismProvider)

export { l2OptimismProvider }
export default l2OptimismWallet
