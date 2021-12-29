import MetamaskNetworkMainnet from 'src/assets/onboard/metamask-network-mainnet.png'
import MetamaskNetworkKovan from 'src/assets/onboard/metamask-network-kovan.png'
import MetamaskNetworkGoerli from 'src/assets/onboard/metamask-network-goerli.png'
import MetamaskNetworkRinkeby from 'src/assets/onboard/metamask-network-rinkeby.png'
import MetamaskNetworkRopsten from 'src/assets/onboard/metamask-network-ropsten.png'

const images: any = {
  mainnet: MetamaskNetworkMainnet,
  kovan: MetamaskNetworkKovan,
  goerli: MetamaskNetworkGoerli,
  ropsten: MetamaskNetworkRopsten,
  rinkeby: MetamaskNetworkRinkeby,
}

export const getNetworkSpecificMetamaskImage = (networkName: string): string => {
  const name = networkName.toLowerCase()
  return images[name] || ''
}
