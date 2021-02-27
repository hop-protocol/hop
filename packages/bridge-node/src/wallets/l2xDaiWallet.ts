import * as ethers from 'ethers'
import { bonderPrivateKey } from 'src/config'
import { getRpcUrl } from 'src/utils'

const rpcUrl = getRpcUrl('xdai')
const l2xDaiProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
const l2xDaiWallet = new ethers.Wallet(bonderPrivateKey, l2xDaiProvider)

export { l2xDaiProvider }
export default l2xDaiWallet
