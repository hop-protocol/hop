import * as ethers from 'ethers'
import { bonderPrivateKey, L2ArbitrumRpcUrl } from 'src/config'

const L2ArbitrumProvider = new ethers.providers.JsonRpcProvider(
  L2ArbitrumRpcUrl
)
const L2ArbitrumWallet = new ethers.Wallet(bonderPrivateKey, L2ArbitrumProvider)

export { L2ArbitrumProvider }
export default L2ArbitrumWallet
