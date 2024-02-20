import { Chain } from 'src/constants/index.js'

const isL1 = (network: string) => {
  return network === Chain.Ethereum
}

export default isL1
