import { KOVAN, GOERLI, MAINNET } from 'src/constants'
const network = process.env.NETWORK || KOVAN
export const isTestMode = !!process.env.TEST_MODE

const getConfigByNetwork = (network: string) => {
  let addresses: any
  let networks: any
  if (isTestMode) {
    ;({ addresses, networks } = require('./test'))
  }
  if (network === KOVAN) {
    ;({ addresses, networks } = require('./kovan'))
  }
  if (network === GOERLI) {
    ;({ addresses, networks } = require('./goerli'))
  }
  if (network === MAINNET) {
    ;({ addresses, networks } = require('./mainnet'))
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
  networks
}

const setConfigByNetwork = (network: string) => {
  const { tokens, networks } = getConfigByNetwork(network)
  config.tokens = tokens
  config.networks = networks
}

export { setConfigByNetwork }
