import { utils } from 'ethers'

export type Addressish = Address | string

export class Address {
  public readonly address: string

  constructor(address: string) {
    this.address = utils.getAddress(address)
  }

  static getAddress(address: Addressish): Address {
    if (address instanceof Address) {
      return address
    } else if (typeof address === 'string') {
      return new Address(address)
    } else {
      throw new Error('Invalid address')
    }
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
    return Address.getAddress(address).toLowercase() === this.toLowercase()
  }
}

export const getAddress = Address.getAddress
