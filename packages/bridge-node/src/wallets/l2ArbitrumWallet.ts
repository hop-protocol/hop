import * as ethers from 'ethers'
import { bonderPrivateKey } from 'src/config'
import { getRpcUrl } from 'src/utils'

const rpcUrl = getRpcUrl('arbitrum')
const l2ArbitrumProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
const l2ArbitrumWallet = new ethers.Wallet(bonderPrivateKey, l2ArbitrumProvider)

export { l2ArbitrumProvider }
export default l2ArbitrumWallet
