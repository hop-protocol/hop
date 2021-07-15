const { metadata } = require('./metadata')
const mainnet = require('./mainnet')
const kovan = require('./kovan')
const goerli = require('./goerli')

const addresses: { [key: string]: any } = {
  mainnet: mainnet.addresses,
  kovan: kovan.addresses,
  goerli: goerli.addresses
}

const chains: { [key: string]: any } = {
  mainnet: mainnet.chains,
  kovan: kovan.chains,
  goerli: goerli.chains
}

const bonders: { [key: string]: string[] } = {
  mainnet: mainnet.bonders,
  kovan: kovan.bonders,
  goerli: goerli.bonders
}

const config = {
  addresses,
  chains,
  bonders
}

export { metadata, config }
