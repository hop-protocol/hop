import { BigNumber } from 'ethers'

export function sumAmounts (items: any) {
  let sum = BigNumber.from(0)
  for (let item of items) {
    const amount = BigNumber.from(item.amount)
    sum = sum.add(amount)
  }
  return sum
}
