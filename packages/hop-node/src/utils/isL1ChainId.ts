const isL1ChainId = (chainId: number | string) => {
  return ['1', '5', '42'].includes(chainId.toString())
}

export default isL1ChainId
