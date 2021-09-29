import { getAddress } from '@ethersproject/address'

function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export default isAddress
