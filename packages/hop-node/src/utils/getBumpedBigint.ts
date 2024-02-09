
import { parseUnits } from 'ethers'

export default function getBumpedBigint (value: bigint, multiplier: number = 1) {
  return value * parseUnits(multiplier.toString(), 100) / (parseUnits('1', 100))
}
