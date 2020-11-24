import * as ethers from 'ethers'
import MockMessengerAbi from 'src/abi/MockMessenger.json'
import { L2ArbitrumMessengerAddress } from 'src/config'
import L2ArbitrumWallet from 'src/wallets/L2ArbitrumWallet'

const L2ArbitrumMockMessengerContract = new ethers.Contract(
  L2ArbitrumMessengerAddress,
  MockMessengerAbi,
  L2ArbitrumWallet
)

export default L2ArbitrumMockMessengerContract
