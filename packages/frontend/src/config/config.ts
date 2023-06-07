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
    ethereum: 3,
    optimism: 3,
    arbitrum: 3,
    polygon: 3,
    nova: 3
  },
  nova: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 1,
    gnosis: 1
  }
}
