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
    arbitrum: 20,
    polygon: 30,
    gnosis: 5,
    nova: 20
  },
  optimism: {
    ethereum: 1,
    arbitrum: 1,
    polygon: 5,
    gnosis: 1,
    nova: 1
  },
  arbitrum: {
    ethereum: 1,
    optimism: 1,
    polygon: 5,
    gnosis: 1,
    nova: 1
  },
  polygon: {
    ethereum: 15,
    optimism: 15,
    arbitrum: 15,
    gnosis: 15,
    nova: 15
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
    polygon: 5,
    gnosis: 1
  }
}
