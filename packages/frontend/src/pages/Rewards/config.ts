import { reactAppNetwork } from 'src/config'

let configs :any[] = []

if (reactAppNetwork === 'goerli') {
  configs = [{
    chainId: 420,
    rewardsContractAddress: '0x5D13179c5fa40b87D53Ff67ca26245D3D5B2F872',
    merkleBaseUrl: 'https://raw.githubusercontent.com/hop-protocol/goerli-test-merkle-rewards-data/master'
  }]
} else {
  configs = [{
    chainId: 10,
    rewardsContractAddress: '0xFfAF1B79fE7C03D833E3DEF83eA558B1989399c5',
    merkleBaseUrl: 'https://raw.githubusercontent.com/hop-protocol/optimism-refund-merkle-rewards/master'
  }]
}

export { configs }
