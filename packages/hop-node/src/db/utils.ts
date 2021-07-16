import { BigNumber } from 'ethers'

export function normalizeBigNumber (item: any, prop: string): any {
  if (item?.[prop] && item?.[prop]?.type === 'BigNumber') {
    item[prop] = BigNumber.from(item[prop]?.hex)
  }

  return item
}
