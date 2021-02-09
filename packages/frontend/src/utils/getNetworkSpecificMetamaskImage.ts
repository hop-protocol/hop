import MetamaskNetworkMainnet from 'src/assets/onboard/metamask-network-mainnet.png'
import MetamaskNetworkKovan from 'src/assets/onboard/metamask-network-kovan.png'
import MetamaskNetworkGoerli from 'src/assets/onboard/metamask-network-goerli.png'
import MetamaskNetworkRinkeby from 'src/assets/onboard/metamask-network-rinkeby.png'
import MetamaskNetworkRopsten from 'src/assets/onboard/metamask-network-ropsten.png'

const getNetworkSpecificMetamaskImage = (networkName: string): string => {
  const name = networkName.toLowerCase()

  if (name === 'mainnet') {
    return MetamaskNetworkMainnet
  } else if (name === 'kovan') {
    return MetamaskNetworkKovan
  } else if (name === 'goerli') {
    return MetamaskNetworkGoerli
  } else if (name === 'ropsten') {
    return MetamaskNetworkRopsten
  } else if (name === 'rinkeby') {
    return MetamaskNetworkRinkeby
  } else {
    throw new Error('Invalid network name')
  }
}

export default getNetworkSpecificMetamaskImage
