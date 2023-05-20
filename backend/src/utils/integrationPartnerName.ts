// TODO: move to config
const names = {
  socket: 'Socket',
  lifi: 'LI.FI',
  metamask: 'MetaMask',
  chainhop: 'ChainHop',
  viaprotocol: 'ViaProtocol'
}

export function integrationPartnerName (slug: string) {
  return names[slug]
}
