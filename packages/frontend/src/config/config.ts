export const showBannerMessage = process.env.REACT_APP_SHOW_BANNER_MESSAGE || ''
export const gitRevision = process.env.REACT_APP_GIT_SHA || ''

// show rewards header nav route
let showRewards = true
if (process.env.REACT_APP_NETWORK === 'goerli') {
  showRewards = false
}

export { showRewards }

export const orusThatRelyOnL1ConfirmationsForFinality: string[] = [
  'optimism',
  'arbitrum',
  'nova',
]

export const transferTimes = {
  ethereum: {
    optimism: 2,
    arbitrum: 12,
    polygon: 30,
    gnosis: 5,
    nova: 12
  },
  optimism: {
    ethereum: 17,
    arbitrum: 17,
    polygon: 17,
    gnosis: 17,
    nova: 17
  },
  arbitrum: {
    ethereum: 17,
    optimism: 17,
    polygon: 17,
    gnosis: 17,
    nova: 17
  },
  polygon: {
    ethereum: 20,
    optimism: 20,
    arbitrum: 20,
    gnosis: 20,
    nova: 20
  },
  gnosis: {
    ethereum: 5,
    optimism: 5,
    arbitrum: 5,
    polygon: 5,
    nova: 5
  },
  nova: {
    ethereum: 17,
    optimism: 17,
    arbitrum: 17,
    polygon: 17,
    gnosis: 17
  }
}
