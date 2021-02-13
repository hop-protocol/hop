import * as ethers from 'ethers'
import { bonderPrivateKeyOld, l1EthRpcUrl } from 'src/config'

const l1Provider = new ethers.providers.JsonRpcProvider(l1EthRpcUrl)
const l1Wallet = new ethers.Wallet(bonderPrivateKeyOld, l1Provider)

export { l1Provider }
export default l1Wallet
