const { metadata } = require('./metadata')
const mainnet = require('./mainnet')
const staging = require('./staging')
const kovan = require('./kovan')
const goerli = require('./goerli')

const addresses: { [network: string]: any } = {
  mainnet: mainnet.addresses,
  staging: staging.addresses,
  kovan: kovan.addresses,
  goerli: goerli.addresses
}

const chains: { [network: string]: any } = {
  mainnet: mainnet.chains,
  staging: staging.chains,
  kovan: kovan.chains,
  goerli: goerli.chains
}

const bonders: { [network: string]: { [token: string]: string[] } } = {
  mainnet: mainnet.bonders,
  staging: staging.bonders,
  kovan: kovan.bonders,
  goerli: goerli.bonders
}

const config = {
  addresses,
  chains,
  bonders
}

export { metadata, config }
