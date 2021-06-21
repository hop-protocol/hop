import { Network, Chain, Total_Blocks } from 'src/constants'

const { metadata } = require('./metadata')
const network = process.env.NETWORK || Network.Kovan
export const isTestMode = !!process.env.TEST_MODE

let bonders: string[] = []
let isMainnet = network === Network.Mainnet

const getConfigByNetwork = (_network: string) => {
  let addresses: any
  let networks: any
  if (isTestMode) {
    ;({ addresses, networks, bonders } = require('./test'))
  }
  if (_network === Network.Kovan) {
    ;({ addresses, networks, bonders } = require('./kovan'))
  }
  if (_network === Network.Goerli) {
    ;({ addresses, networks, bonders } = require('./goerli'))
  }
  if (_network === Network.Mainnet) {
    ;({ addresses, networks, bonders } = require('./mainnet'))
  }

  const tokens: {
    [key: string]: {
      [key: string]: {
        [key: string]: string
      }
    }
  } = {
    ...addresses
  }

  return {
    tokens,
    networks,
    bonders
  }
}

type SyncConfig = {
  totalBlocks: number
  batchBlocks: number
}

type SyncConfigs = { [key: string]: Partial<SyncConfig> }

const { tokens, networks } = getConfigByNetwork(network)
export const config: any = {
  isMainnet,
  tokens,
  network,
  networks,
  bonderPrivateKey: process.env.BONDER_PRIVATE_KEY,
  relayerPrivateKey: process.env.RELAYER_PRIVATE_KEY,
  metadata,
  bonders,
  sync: {
    [Chain.Ethereum]: {
      totalBlocks: Total_Blocks.Ethereum,
      batchBlocks: 1_000
    },
    [Chain.Arbitrum]: {
      totalBlocks: 100_000,
      batchBlocks: 1_000
    },
    [Chain.Optimism]: {
      totalBlocks: 100_000,
      batchBlocks: 1_000
    },
    [Chain.Polygon]: {
      totalBlocks: Total_Blocks.Polygon,
      batchBlocks: 1_000
    },
    [Chain.xDai]: {
      totalBlocks: Total_Blocks.xDai,
      batchBlocks: 1_000
    }
  }
}

const setConfigByNetwork = (_network: string) => {
  const { tokens, networks, bonders } = getConfigByNetwork(_network)
  isMainnet = _network === Network.Mainnet
  config.isMainnet = isMainnet
  config.tokens = tokens
  config.network = _network
  config.networks = networks
  config.bonder = bonders
}

const setBonderPrivateKey = (privateKey: string) => {
  config.bonderPrivateKey = privateKey
}

export const setNetworkRpcUrls = (_network: string, rpcUrls: string[]) => {
  if (config.networks[_network]) {
    config.networks[_network].rpcUrls = rpcUrls
  }
}

export const setNetworkWaitConfirmations = (
  _network: string,
  waitConfirmations: number
) => {
  if (config.networks[network]) {
    config.networks[_network].waitConfirmations = waitConfirmations
  }
}

const setSyncConfig = (syncConfigs: SyncConfigs = {}) => {
  const networks = Object.keys(config.networks)
  for (let network of networks) {
    if (!config.sync[network]) {
      config.sync[network] = {}
    }
    if (syncConfigs[network]?.totalBlocks) {
      config.sync[network].totalBlocks = syncConfigs[network]?.totalBlocks
    }
    if (syncConfigs[network]?.batchBlocks) {
      config.sync[network].batchBlocks = syncConfigs[network]?.batchBlocks
    }
  }
}

export { setConfigByNetwork, setBonderPrivateKey, setSyncConfig }
