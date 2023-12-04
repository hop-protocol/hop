export function getEtherscanApiKey (network: string, chain: string): string {
  return process.env[`ETHERSCAN_${chain.toUpperCase()}_API_KEY`] ?? ''
}
