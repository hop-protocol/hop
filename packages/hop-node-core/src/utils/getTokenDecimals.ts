import getTokenMetadata from './getTokenMetadata.js'

function getTokenDecimals (tokenSymbol: string): number {
  return getTokenMetadata(tokenSymbol)?.decimals
}

export default getTokenDecimals
