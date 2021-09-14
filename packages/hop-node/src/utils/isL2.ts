import { Chain } from 'src/constants'

const isL2 = (network: string) => {
  return network !== Chain.Ethereum
}

export default isL2
