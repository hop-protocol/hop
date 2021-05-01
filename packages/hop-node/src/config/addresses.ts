import { KOVAN, GOERLI, MAINNET } from 'src/constants'
const network = process.env.NETWORK || KOVAN
export const isTestMode = !!process.env.TEST_MODE

let bonders: string[] = []

const getConfigByNetwork = (network: string) => {
  let addresses: any
  let networks: any
  if (isTestMode) {
    ;({ addresses, networks, bonders } = require('./test'))
  }
  if (network === KOVAN) {
    ;({ addresses, networks, bonders } = require('./kovan'))
  }
  if (network === GOERLI) {
    ;({ addresses, networks, bonders } = require('./goerli'))
  }
  if (network === MAINNET) {
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
  tokens,
  networks,
  bonderPrivateKey: process.env.BONDER_PRIVATE_KEY,
  safeConfirmations: network === MAINNET ? 12 : 0
}

const setConfigByNetwork = (network: string) => {
  const { tokens, networks } = getConfigByNetwork(network)
  config.tokens = tokens
  config.networks = networks
  config.safeConfirmations = network === MAINNET ? 12 : 0
}

const setBonderPrivateKey = (privateKey: string) => {
  config.bonderPrivateKey = privateKey
}

const setNetworkRpcUrl = (network: string, rpcUrl: string) => {
  networks[network].rpcUrl = rpcUrl
}

export { setConfigByNetwork, setBonderPrivateKey, setNetworkRpcUrl }
export { bonders }
