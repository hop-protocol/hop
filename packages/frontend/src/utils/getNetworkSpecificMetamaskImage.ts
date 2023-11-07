import MetamaskNetworkMainnet from 'src/assets/onboard/metamask-network-mainnet.png'
import MetamaskNetworkGoerli from 'src/assets/onboard/metamask-network-goerli.png'

const images: any = {
  mainnet: MetamaskNetworkMainnet,
  goerli: MetamaskNetworkGoerli
}

export const getNetworkSpecificMetamaskImage = (networkName: string): string => {
  const name = networkName.toLowerCase()
  return images[name] || ''
}
