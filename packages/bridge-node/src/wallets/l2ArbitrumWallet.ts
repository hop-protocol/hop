import * as ethers from 'ethers'
import { bonderPrivateKey, l2ArbitrumRpcUrl } from 'src/config'

const l2ArbitrumProvider = new ethers.providers.JsonRpcProvider(
  l2ArbitrumRpcUrl
)
const l2ArbitrumWallet = new ethers.Wallet(bonderPrivateKey, l2ArbitrumProvider)

export { l2ArbitrumProvider }
export default l2ArbitrumWallet
