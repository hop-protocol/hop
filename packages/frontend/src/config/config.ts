import { providers } from 'ethers'

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
    gnosis: 20,
    nova: 10,
    polygonzkevm: 20,
    base: 2,
    linea: 20
  },
  optimism: {
    ethereum: 25,
    arbitrum: 25,
    polygon: 25,
    gnosis: 25,
    nova: 25,
    polygonzkevm: 25,
    base: 25,
    linea: 25
  },
  arbitrum: {
    ethereum: 12,
    optimism: 12,
    polygon: 12,
    gnosis: 12,
    nova: 12,
    polygonzkevm: 12,
    base: 12,
    linea: 12
  },
  polygon: {
    ethereum: 10,
    optimism: 10,
    arbitrum: 10,
    gnosis: 10,
    nova: 10,
    polygonzkevm: 10,
    base: 10,
    linea: 10
  },
  gnosis: {
    ethereum: 4,
    optimism: 4,
    arbitrum: 4,
    polygon: 4,
    nova: 4,
    polygonzkevm: 4,
    base: 4,
    linea: 4
  },
  nova: {
    ethereum: 12,
    optimism: 12,
    arbitrum: 12,
    polygon: 12,
    gnosis: 12,
    polygonzkevm: 12,
    base: 12,
    linea: 12
  },
  base: {
    ethereum: 25,
    optimism: 25,
    arbitrum: 25,
    polygon: 25,
    gnosis: 25,
    nova: 25,
    polygonzkevm: 25,
    linea: 25
  },
  linea: {
    ethereum: 20,
    optimism: 20,
    arbitrum: 20,
    polygon: 20,
    gnosis: 20,
    nova: 20,
    polygonzkevm: 20,
    base: 20
  }
}

export const WaitConfirmations: Record<string, number> = {
  ethereum: 32,
  gnosis: 40, // Gnosis safe at 5.5 sec per block
  polygon: 128,
  optimism: 222, // Optimism Safe + L1 Safe at 2 sec per block
  arbitrum: 1776, // Arbitrum Safe at 250 msec per block
  zksync: 1,
  linea: 75,
  scrollzk: 1,
  nova: 1776, // Arbitrum Safe at 250 msec per block
  base: 222, // Optimism Safe + L1 Safe at 2 sec per block
  polygonzk: 1
}

const rpcProviderOverrides: Record<string, providers.Provider>  = {}

for (const chain in WaitConfirmations) {
  const rpcUrl = process.env[`REACT_APP_${chain.toUpperCase()}_RPC_URL`]
  if (rpcUrl) {
    rpcProviderOverrides[chain] = new providers.JsonRpcProvider(rpcUrl)
  }
}

export { rpcProviderOverrides }
