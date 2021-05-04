const { metadata } = require('./metadata')
const mainnet = require('./mainnet')
const kovan = require('./kovan')
const goerli = require('./goerli')

const addresses = {
  mainnet: mainnet.addresses,
  kovan: kovan.addresses,
  goerli: goerli.addresses
}

const chains = {
  mainnet: mainnet.chains,
  kovan: kovan.chains,
  goerli: goerli.chains
}

export { addresses, chains, metadata }
