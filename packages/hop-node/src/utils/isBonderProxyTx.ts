import { Contract, constants } from 'ethers'
import { getConfigBonderForRoute } from 'src/config'
import getNonRetryableRpcProvider from 'src/utils/getNonRetryableRpcProvider'

const cache: any = {}

export const isBonderProxyTx = async (
  token: string,
  sourceChain: string,
  destinationChain: string,
  retryCount: number = 0
): Promise<boolean> => {
  const cacheKey = token + sourceChain + destinationChain
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }

  // If there is a bonder proxy and the from address is the EOA, we know that the bonder was the proxy
  const bonderForRoute = getConfigBonderForRoute(token, sourceChain, destinationChain)

  // We must use the default ethers provider so that the the call does not exponentially retry upon failure
  const provider = getNonRetryableRpcProvider(destinationChain)!
  const abi = ['function bonderEoa() view returns (address)']
  const contract = new Contract(bonderForRoute, abi, provider)

  let bonderEoa: string
  try {
    bonderEoa = await contract.callStatic.bonderEoa()
  } catch (err) {
    // Since an RPC call can fail another way and it is difficult to capture all possible errors from all providers, we
    // retry the call a few times before giving up
    if (retryCount >= 2) {
      cache[cacheKey] = false
      return false
    }

    // A call will fail if the address is an EOA or if the address does not have the bonderEoa state var as a public getter
    const isBonderProxy = await isBonderProxyTx(token, sourceChain, destinationChain, retryCount + 1)
    cache[cacheKey] = isBonderProxy
    console.log('here')
    return isBonderProxy
  }

  // If there is a state var but it is unset, the call will return the zero address
  if (bonderEoa === constants.AddressZero) {
    cache[cacheKey] = false
    return false
  }

  cache[cacheKey] = true
  return true
}

export default isBonderProxyTx
