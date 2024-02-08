// TODO: move to config
const names: any = {
  socket: 'Socket',
  lifi: 'LI.FI',
  metamask: 'MetaMask',
  chainhop: 'ChainHop',
  viaprotocol: 'ViaProtocol'
}

export function integrationPartnerName (slug: string) {
  return names[slug]
}
