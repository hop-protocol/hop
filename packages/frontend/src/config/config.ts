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
  'base'
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
    ethereum: 3,
    arbitrum: 3,
    polygon: 3,
    gnosis: 3,
    nova: 3
  },
  arbitrum: {
    ethereum: 1,
    optimism: 1,
    polygon: 1,
    gnosis: 1,
    nova: 1
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
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 1,
    gnosis: 1
  }
}
