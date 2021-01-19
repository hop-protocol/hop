import * as ethers from 'ethers'
import { bonderPrivateKey, L2ArbitrumRpcUrl } from 'src/config'

const L2Provider = new ethers.providers.JsonRpcProvider(L2ArbitrumRpcUrl)
const L2Wallet = new ethers.Wallet(bonderPrivateKey, L2Provider)

export { L2Provider }
export default L2Wallet
