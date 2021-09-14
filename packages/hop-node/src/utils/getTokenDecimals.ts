import getTokenMetadata from './getTokenMetadata'

function getTokenDecimals (tokenSymbol: string): number {
  return getTokenMetadata(tokenSymbol)?.decimals
}

export default getTokenDecimals
