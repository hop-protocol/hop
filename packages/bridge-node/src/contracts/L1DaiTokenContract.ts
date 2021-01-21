import * as ethers from 'ethers'
import Erc20Abi from 'src/abi/ERC20.json'
import { L1DaiAddress } from 'src/config'
import L1Wallet from 'src/wallets/L1Wallet'

const L1DaiTokenContract = new ethers.Contract(L1DaiAddress, Erc20Abi, L1Wallet)

export default L1DaiTokenContract
