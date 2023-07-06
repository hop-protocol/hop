// TODO: move to config
const tokenLogosMap: any = {
  USDC: 'https://assets.hop.exchange/logos/usdc.svg',
  USDT: 'https://assets.hop.exchange/logos/usdt.svg',
  DAI: 'https://assets.hop.exchange/logos/dai.svg',
  MATIC: 'https://assets.hop.exchange/logos/matic.svg',
  ETH: 'https://assets.hop.exchange/logos/eth.svg',
  WBTC: 'https://assets.hop.exchange/logos/wbtc.svg',
  FRAX: 'https://assets.hop.exchange/logos/frax.svg',
  HOP: 'https://assets.hop.exchange/logos/hop.svg',
  SNX: 'https://assets.hop.exchange/logos/snx.svg',
  sUSD: 'https://assets.hop.exchange/logos/susd.svg',
  UNI: 'https://assets.hop.exchange/logos/uni.svg',
  rETH: 'https://assets.hop.exchange/logos/reth.svg',
  MAGIC: 'https://assets.hop.exchange/logos/magic.svg'
}

export function getTokenLogo (tokenSymbol: string) {
  return tokenLogosMap[tokenSymbol]
}
