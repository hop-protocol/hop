import { BigNumber } from 'ethers'

export function normalizeDbItem (item: any) {
  for (const key in item) {
    if (item[key]?.type === 'BigNumber') {
      item = normalizeBigNumber(item, key)
    }
  }

  return item
}

export function normalizeBigNumber (item: any, prop: string): any {
  if (item?.[prop] && item?.[prop]?.type === 'BigNumber') {
    item[prop] = BigNumber.from(item[prop]?.hex)
  }

  return item
}
