const names = {
  socket: 'Socket',
  lifi: 'LI.FI',
  metamask: 'MetaMask',
  chainhop: 'ChainHop'
}

export function integrationPartnerName (slug: string) {
  return names[slug]
}
