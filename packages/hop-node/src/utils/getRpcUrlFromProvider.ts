import { Provider } from 'ethers'

// TODO: fix this
type Provider = Provider & {
  connection?: {
    url: string
  }
  providers?: Provider[]
}

function getRpcUrlFromProvider (provider: Provider): string {
  return provider?.connection?.url ?? provider.providers?.[0]?.connection?.url ?? ''
}

export default getRpcUrlFromProvider
