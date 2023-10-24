import fetch from 'node-fetch'
import getRpcUrlFromProvider from './getRpcUrlFromProvider'
import { RootProviderName } from 'src/constants'
import { promiseTimeout } from './promiseTimeout'
import { providers } from 'ethers'

// Intentionally force a call to a method that is not supported by all providers
const unsupportedCallMethod = 'eth_unsupportedCall'

// Full error message for an eth_unsupportedCall
// alchemy: {"jsonrpc":"2.0","id":1,"error":{"code":-32600,"message":"Unsupported method: eth_unsupportedCall. See available methods at https://docs.alchemy.com/alchemy/documentation/apis"}}
// infura: {"jsonrpc":"2.0","id":1,"error":{"code":-32601,"message":"The method eth_unsupportedCall does not exist/is not available"}}
// quiknode: {"jsonrpc":"2.0","error":{"code":-32601,"message":"Method eth_unsupportedCall is not supported"},"id":1}
enum rpcRootProviderErrorString {
  Alchemy = 'alchemy',
  Infura = 'does not exist/is not available',
  Quiknode = 'Method eth_unsupportedCall is not supported'
}

const cache: Record<string, RootProviderName> = {}

async function getRpcRootProviderName (providerOrUrl: providers.Provider | string, onlyAttemptUrl?: boolean): Promise<RootProviderName | undefined> {
  // Cache by top-level URL
  const url = getUrlFromProviderOrUrl(providerOrUrl)
  if (cache[url]) {
    return cache[url]
  }

  let providerName: RootProviderName | undefined = getRootProviderNameFromUrl(providerOrUrl)
  if (providerName) {
    return providerName
  }

  // This is useful if you want this function to be synchronous and not make any RPC calls
  const isWsProvider = url.includes('wss://')
  if (isWsProvider || onlyAttemptUrl) {
    return
  }

  providerName = await getRootProviderNameFromRpcCall(providerOrUrl)
  if (providerName) {
    cache[url] = providerName
    return providerName
  }
}

function getRootProviderNameFromUrl (providerOrUrl: providers.Provider | string): RootProviderName | undefined {
  const url = getUrlFromProviderOrUrl(providerOrUrl)
  const entries = Object.entries(RootProviderName)
  for (const [key, value] of entries) {
    if (url.includes(value)) {
      return RootProviderName[key as keyof typeof RootProviderName]
    }
  }
}

async function getRootProviderNameFromRpcCall (providerOrUrl: providers.Provider | string): Promise<RootProviderName | undefined> {
  const callTimeout: number = 2_000
  const query = {
    id: 1,
    jsonrpc: '2.0',
    method: unsupportedCallMethod,
    params: []
  }

  let url
  if (providerOrUrl instanceof providers.Provider) {
    url = getRpcUrlFromProvider(providerOrUrl)
  } else {
    url = providerOrUrl
  }

  let res
  try {
    res = await promiseTimeout(fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(query)
    }), callTimeout)
  } catch (err) {
    return
  }

  const jsonRes = await res.json()
  if (!jsonRes?.error) {
    return
  }

  const errMessage = jsonRes.error.message
  const entries = Object.entries(rpcRootProviderErrorString)
  for (const [key, value] of entries) {
    if (errMessage.includes(value)) {
      return RootProviderName[key as keyof typeof RootProviderName]
    }
  }
}

function getUrlFromProviderOrUrl (providerOrUrl: providers.Provider | string): string {
  if (providerOrUrl instanceof providers.Provider) {
    return getRpcUrlFromProvider(providerOrUrl)
  } else {
    return providerOrUrl
  }
}

export default getRpcRootProviderName
