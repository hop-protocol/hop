import { NetworkSlug } from '@hop-protocol/sdk'

export const network = 'sepolia'

// export const chainIds = ['84532', '11155420', '11155111']
export const chainIds = ['11155420', '11155111']

export const defaultChainIds = {
  from: chainIds[0],
  to: chainIds[1]
}

export const reactAppNetwork = process.env.REACT_APP_NETWORK ?? NetworkSlug.Mainnet
export const isMainnet = reactAppNetwork === NetworkSlug.Mainnet
export const isSepolia = reactAppNetwork === NetworkSlug.Sepolia

export const walletConnectProjectId = '651b16cdb6b0f490f68e0c4c5f5c35ce' // This is is meant to be public
