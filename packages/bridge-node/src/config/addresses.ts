export const rpcUrls: { [key: string]: string } = {
  kovan: 'https://kovan.rpc.hop.exchange',
  optimism: 'https://kovan.optimism.io',
  arbitrum: 'https://kovan3.arbitrum.io/rpc',
  xdai: 'https://sokol.poa.network'
}

export const networkIds: { [key: string]: string } = {
  kovan: '42',
  optimism: '69',
  arbitrum: '79377087078960',
  xdai: '77'
}

export const isTestMode = !!process.env.TEST_MODE
const { addresses } = isTestMode ? require('./test') : require('./kovan')

export const tokens: {
  [key: string]: {
    [key: string]: {
      [key: string]: string
    }
  }
} = {
  ...addresses
}
