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
    arbitrum: 10,
    polygon: 20,
    gnosis: 5,
    nova: 10,
    polygonzkevm: 20,
    base: 2
  },
  optimism: {
    ethereum: 25,
    arbitrum: 25,
    polygon: 25,
    gnosis: 25,
    nova: 25,
    polygonzkevm: 25,
    base: 25
  },
  arbitrum: {
    ethereum: 12,
    optimism: 12,
    polygon: 12,
    gnosis: 12,
    nova: 12,
    polygonzkevm: 12,
    base: 12
  },
  polygon: {
    ethereum: 60,
    optimism: 60,
    arbitrum: 60,
    gnosis: 60,
    nova: 60,
    polygonzkevm: 60,
    base: 60
  },
  gnosis: {
    ethereum: 4,
    optimism: 4,
    arbitrum: 4,
    polygon: 4,
    nova: 4,
    polygonzkevm: 4,
    base: 4
  },
  nova: {
    ethereum: 12,
    optimism: 12,
    arbitrum: 12,
    polygon: 12,
    gnosis: 12,
    polygonzkevm: 12,
    base: 12
  },
  base: {
    ethereum: 25,
    optimism: 25,
    arbitrum: 25,
    polygon: 25,
    gnosis: 25,
    nova: 25,
    polygonzkevm: 25
  },
}
