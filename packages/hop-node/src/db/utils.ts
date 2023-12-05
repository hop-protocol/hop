import { BigNumber } from 'ethers'

export function normalizeDbValue (value: any) {
  for (const prop in value) {
    if (value[prop]?.type === 'BigNumber') {
      value = normalizeBigNumber(value, prop)
    }
  }

  return value
}

function normalizeBigNumber (value: any, prop: string): any {
  if (value?.[prop] && value?.[prop]?.type === 'BigNumber') {
    value[prop] = BigNumber.from(value[prop]?.hex)
  }

  return value
}
