import * as ethers from 'ethers'
import Erc20Abi from 'src/abi/ERC20.json'
import { L1PoolTokenAddress } from 'src/config'
import L1Wallet from 'src/wallets/L1Wallet'

const L1PoolTokenContract = new ethers.Contract(
  L1PoolTokenAddress,
  Erc20Abi,
  L1Wallet
)

export default L1PoolTokenContract
