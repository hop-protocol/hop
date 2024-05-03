import { RpcProviderSlug, RpcProvider } from './types.js'

export const rpcProviders: RpcProvider = {
  [RpcProviderSlug.Local]: {
    name: 'Local',
    wsSupported: false
  },
  [RpcProviderSlug.Alchemy]: {
    name: 'Alchemy',
    wsSupported: true
  },
  [RpcProviderSlug.Infura]: {
    name: 'Infura',
    wsSupported: false
  },
  [RpcProviderSlug.Quiknode]: {
    name: 'Quiknode',
    wsSupported: true
  }
}
