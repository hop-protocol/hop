import { Network } from 'src/constants'

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
    networks
  }
}

const { tokens, networks } = getConfigByNetwork(network)
export const config = {
  isMainnet,
  tokens,
  network,
  networks,
  bonderPrivateKey: process.env.BONDER_PRIVATE_KEY,
  metadata,
  bonders,
  syncBlocksTotal: 100_000,
  syncBlocksBatch: 1_000
}

const setConfigByNetwork = (_network: string) => {
  const { tokens, networks } = getConfigByNetwork(_network)
  isMainnet = _network === Network.Mainnet
  config.isMainnet = isMainnet
  config.tokens = tokens
  config.network = _network
  config.networks = networks
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

export { setConfigByNetwork, setBonderPrivateKey }
