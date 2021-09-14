import { Chain } from 'src/constants'

const isL1 = (network: string) => {
  return network === Chain.Ethereum
}

export default isL1
