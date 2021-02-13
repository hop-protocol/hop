import * as ethers from 'ethers'
import { bonderPrivateKey, l1EthRpcUrl } from 'src/config'

const l1Provider = new ethers.providers.JsonRpcProvider(l1EthRpcUrl)
const l1Wallet = new ethers.Wallet(bonderPrivateKey, l1Provider)

export { l1Provider }
export default l1Wallet
