// TODO: move to config
const imageUrls: any = {
  socket: 'https://assets.hop.exchange/logos/socket.jpg',
  lifi: 'https://assets.hop.exchange/logos/lifi.webp',
  metamask: 'https://assets.hop.exchange/logos/metamask.svg',
  chainhop: 'https://assets.hop.exchange/logos/chainhop.png',
  viaprotocol: 'https://assets.hop.exchange/logos/viaprotocol.jpg'
}

export function integrationPartnerImage (slug: string) {
  return imageUrls[slug]
}
