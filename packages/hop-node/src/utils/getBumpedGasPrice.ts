import getBumpedBigint from './getBumpedBigint'

export default function getBumpedGasPrice (gasPrice: bigint, multiplier: number) {
  return getBumpedBigint(gasPrice, multiplier)
}
