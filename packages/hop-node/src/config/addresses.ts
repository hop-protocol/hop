import { Network } from 'src/constants'

const { metadata } = require('./metadata')
const network = process.env.NETWORK || Network.Kovan
export const isTestMode = !!process.env.TEST_MODE

let bonders: string[] = []
let isMainnet = network === Network.Mainnet

const getConfigByNetwork = (network: string) => {
  let addresses: any
  let networks: any
  if (isTestMode) {
    ;({ addresses, networks, bonders } = require('./test'))
  }
  if (network === Network.Kovan) {
    ;({ addresses, networks, bonders } = require('./kovan'))
  }
  if (network === Network.Goerli) {
    ;({ addresses, networks, bonders } = require('./goerli'))
  }
  if (network === Network.Mainnet) {
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
  bonders
}

const setConfigByNetwork = (network: string) => {
  const { tokens, networks } = getConfigByNetwork(network)
  isMainnet = network === Network.Mainnet
  config.isMainnet = isMainnet
  config.tokens = tokens
  config.network = network
  config.networks = networks
}

const setBonderPrivateKey = (privateKey: string) => {
  config.bonderPrivateKey = privateKey
}

export const setNetworkRpcUrl = (network: string, rpcUrl: string) => {
  if (networks[network]) {
    networks[network].rpcUrl = rpcUrl
  }
}

export const setNetworkWaitConfirmations = (
  network: string,
  waitConfirmations: number
) => {
  if (networks[network]) {
    networks[network].waitConfirmations = waitConfirmations
  }
}

export { setConfigByNetwork, setBonderPrivateKey }
