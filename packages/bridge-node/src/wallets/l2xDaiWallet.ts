import * as ethers from 'ethers'
import { bonderPrivateKey, l2xDaiRpcUrl } from 'src/config'

const l2xDaiProvider = new ethers.providers.JsonRpcProvider(l2xDaiRpcUrl)
const l2xDaiWallet = new ethers.Wallet(bonderPrivateKey, l2xDaiProvider)

export { l2xDaiProvider }
export default l2xDaiWallet
