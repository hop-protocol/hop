import * as ethers from 'ethers'
import { bonderPrivateKeyOld, l1EthRpcUrl } from 'src/config'

const L1Provider = new ethers.providers.JsonRpcProvider(l1EthRpcUrl)
const L1Wallet = new ethers.Wallet(bonderPrivateKeyOld, L1Provider)

export { L1Provider }
export default L1Wallet
