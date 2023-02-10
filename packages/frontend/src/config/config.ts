export const showBannerMessage = process.env.REACT_APP_SHOW_BANNER_MESSAGE || ''
export const gitRevision = process.env.REACT_APP_GIT_SHA || ''

// show rewards header nav route
let showRewards = true
if (process.env.REACT_APP_NETWORK === 'goerli') {
  showRewards = false
}

export { showRewards }

export const transferTimes = {
  ethereum: {
    optimism: 10,
    arbitrum: 16,
    polygon: 25,
    gnosis: 5,
    nova: 16
  },
  optimism: {
    ethereum: 1,
    arbitrum: 1,
    polygon: 1,
    gnosis: 1,
    nova: 1
  },
  arbitrum: {
    ethereum: 1,
    optimism: 1,
    polygon: 1,
    gnosis: 1,
    nova: 1
  },
  polygon: {
    ethereum: 5,
    optimism: 5,
    arbitrum: 5,
    gnosis: 5,
    nova: 5
  },
  gnosis: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 1,
    nova: 1
  },
  nova: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 1,
    gnosis: 1
  }
}
