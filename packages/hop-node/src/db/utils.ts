import { BigNumber } from 'ethers'

export function normalizeBigNumber (item: any, prop: string): any {
  if (item?.[prop] && (item?.[prop] as any)?.type === 'BigNumber') {
    item[prop] = BigNumber.from((item[prop] as any)?.hex)
  }

  return item
}
