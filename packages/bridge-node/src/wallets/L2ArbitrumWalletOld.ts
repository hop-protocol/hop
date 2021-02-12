import * as ethers from 'ethers'
import { bonderPrivateKeyOld, l2ArbitrumRpcUrl } from 'src/config'

const L2ArbitrumProvider = new ethers.providers.JsonRpcProvider(
  l2ArbitrumRpcUrl
)
const L2ArbitrumWallet = new ethers.Wallet(
  bonderPrivateKeyOld,
  L2ArbitrumProvider
)

export { L2ArbitrumProvider }
export default L2ArbitrumWallet
