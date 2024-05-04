export enum RpcProviderSlug {
  Local = 'local',
  Alchemy = 'alchemy',
  Infura = 'infura',
  Quiknode = 'quiknode' // Quicknode endpoints are spelled without the c, so we will use that spelling
}

export type RpcProvider = {
  [key in RpcProviderSlug]: {
    name: string
    wsSupported: boolean
  }
}
