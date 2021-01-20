import * as ethers from 'ethers'
import { bonderPrivateKey, L1EthRpcUrl } from 'src/config'

const L1Provider = new ethers.providers.JsonRpcProvider(L1EthRpcUrl)
const L1Wallet = new ethers.Wallet(bonderPrivateKey, L1Provider)

export { L1Provider }
export default L1Wallet
