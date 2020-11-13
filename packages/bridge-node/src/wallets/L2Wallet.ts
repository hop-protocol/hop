import * as ethers from 'ethers'
import { L2RpcUrl } from 'src/config'
import secret from 'src/secret.json'

const { committeePrivateKey } = secret
const L2Provider = new ethers.providers.JsonRpcProvider(L2RpcUrl)
const L2Wallet = new ethers.Wallet(committeePrivateKey, L2Provider)

export { L2Provider }
export default L2Wallet
