import { BigNumber, BigNumberish, utils } from 'ethers'

export function printValues(obj: any) {
  if (!obj) return

  for (const key in obj) {
    let val = obj[key]

    if (typeof obj[key] !== 'string' && obj[key]._isBigNumber) {
      val = val.toString()
    }

    console.log(`${key}:`, val)
  }
}

export function printBalance(name: string = '', value: BigNumber, decimals: BigNumberish = 18) {
  console.log(`${name}:`, utils.formatUnits(value, decimals))
}
