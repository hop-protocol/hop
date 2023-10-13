import { providers } from 'ethers'

function getRpcUrlFromProvider (provider: providers.Provider): string {
  return (provider as any)?.connection?.url ?? (provider as any).providers?.[0]?.connection?.url ?? ''
}

export default getRpcUrlFromProvider
