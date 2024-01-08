import { getQueryParam } from 'src/utils/getQueryParam'
import { isGoerli, isMainnet } from 'src/config'

let configs :any[] = []

if (isGoerli) {
  configs = [{
    chainId: 420,
    rewardsContractAddress: '0x5D13179c5fa40b87D53Ff67ca26245D3D5B2F872',
    merkleBaseUrl: getQueryParam('merkleBaseUrl') || 'https://raw.githubusercontent.com/hop-protocol/goerli-test-merkle-rewards-data/master'
  }]
} else if (isMainnet) {
  configs = [{
    chainId: 10,
    rewardsContractAddress: '0x45269F59aA76bB491D0Fc4c26F468D8E1EE26b73',
    merkleBaseUrl: getQueryParam('merkleBaseUrl') || 'https://raw.githubusercontent.com/hop-protocol/optimism-refund-merkle-rewards/master'
  }]
}

export { configs }
