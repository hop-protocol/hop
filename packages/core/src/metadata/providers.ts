export enum ProviderSlug {
  Local = 'local',
  Alchemy = 'alchemy',
  Infura = 'infura',
  Quiknode = 'quiknode' // Quicknode endpoints are spelled without the c, so we will use that spelling
}

export type Provider = {
  [key in ProviderSlug]: {
    name: string
    wsSupported: boolean
  }
}

export const providers: Provider = {
  [ProviderSlug.Local]: {
    name: 'Local',
    wsSupported: false
  },
  [ProviderSlug.Alchemy]: {
    name: 'Alchemy',
    wsSupported: true
  },
  [ProviderSlug.Infura]: {
    name: 'Infura',
    wsSupported: false
  },
  [ProviderSlug.Quiknode]: {
    name: 'Quiknode',
    wsSupported: true
  }
}
