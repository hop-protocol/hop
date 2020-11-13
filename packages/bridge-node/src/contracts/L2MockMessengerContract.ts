import * as ethers from 'ethers'
import MockMessenger from 'src/abi/MockMessenger.json'
import { L2MessengerAddress } from 'src/config'
import L2Wallet from 'src/wallets/L2Wallet'

const L2MockMessengerContract = new ethers.Contract(
  L2MessengerAddress,
  MockMessenger,
  L2Wallet
)

export default L2MockMessengerContract
