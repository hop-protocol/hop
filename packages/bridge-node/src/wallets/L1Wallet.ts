import * as ethers from 'ethers'
import { L1RpcUrl } from 'src/config'
import secret from 'src/secret.json'

const { committeePrivateKey } = secret
const L1Provider = new ethers.providers.JsonRpcProvider(L1RpcUrl)
const L1Wallet = new ethers.Wallet(committeePrivateKey, L1Provider)

export { L1Provider }
export default L1Wallet
