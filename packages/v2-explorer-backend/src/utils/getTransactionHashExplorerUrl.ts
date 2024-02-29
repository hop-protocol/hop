const baseUrls: any = {
  1: 'https://etherscan.io/tx/',
  5: 'https://goerli.etherscan.io/tx/',
  10: 'https://optimistic.etherscan.io/tx/',
  420: 'https://goerli-optimism.etherscan.io/tx/'
}

export function getTransactionHashExplorerUrl (transactionHash: string, chainId: number) {
  return `${baseUrls[chainId]}${transactionHash}`
}
