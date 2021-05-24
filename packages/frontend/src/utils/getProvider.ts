import { ethers } from 'ethers'

export default function getProvider (rpcUrl: string) {
  if (rpcUrl.startsWith('ws')) {
    return new ethers.providers.WebSocketProvider(rpcUrl)
  }

  return new ethers.providers.JsonRpcProvider(rpcUrl)
}
