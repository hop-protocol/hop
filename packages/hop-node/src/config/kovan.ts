import { kovan as addresses } from '@hop-protocol/addresses'
export { addresses }

export const networks: any = {
  ethereum: {
    networkId: '42',
    rpcUrl: 'https://kovan.rpc.hop.exchange'
  },
  /*
  arbitrum: {
    networkId: '79377087078960',
    rpcUrl: 'https://kovan3.arbitrum.io/rpc',
    explorerUrl: 'https://explorer.offchainlabs.com/#/'
  },
  */
  optimism: {
    networkId: '69',
    rpcUrl: 'https://kovan.optimism.io'
  },
  xdai: {
    networkId: '77',
    rpcUrl: 'https://sokol.poa.network'
  }
}

export const bonders: string[] = [
  '0xE609c515A162D54548aFe31F4Ec3D951a99cF617',
  '0x50f1EB94F221122d524DCAAc303a2a6082525967'
]
