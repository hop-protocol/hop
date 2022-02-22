import { utils } from 'ethers'

export type Addressish = Address | string | undefined

class Address {
  public readonly address: string

  constructor(address: Addressish) {
    let _address
    if (address instanceof Address) {
      _address = address.toString()
    } else if (typeof address === 'string') {
      _address = utils.getAddress(address)
    }

    if (!_address || !utils.isAddress(_address)) {
      throw new Error('Invalid address')
    }

    this.address = _address
  }

  static from(address: Addressish): Address {
    return new Address(address)
  }

  toString(): string {
    return this.address
  }

  truncate(): string {
    return this.address.slice(0, 6) + '...' + this.address.slice(38, 42)
  }

  toLowercase(): string {
    return this.address.toLowerCase()
  }

  eq(address: Addressish): boolean {
    if (address && utils.isAddress(address?.toString())) {
      return new Address(address).toLowercase() === this.toLowercase()
    }
    return false
  }
}

export default Address
