import { ethers } from 'ethers'
import memoize from 'fast-memoize'

const getProvider = memoize((rpcUrl: string) => {
  if (rpcUrl.startsWith('ws')) {
    return new ethers.providers.WebSocketProvider(rpcUrl)
  }

  return new ethers.providers.StaticJsonRpcProvider({
    url: rpcUrl,
    timeout: 10000
  })
})

export default getProvider
