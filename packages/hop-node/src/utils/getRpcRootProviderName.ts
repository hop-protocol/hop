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

async function getRpcRootProviderName (providerOrUrl: providers.Provider | string): Promise<RootProviderName | undefined> {
  let providerName: RootProviderName | undefined = getRootProviderFromUrl(providerOrUrl)
  if (providerName) {
    return providerName
  }

  // Call this last since it makes an RPC call
  providerName = await isCallErrorAlchemy(providerOrUrl)
  if (providerName) {
    return providerName
  }
}

function getRootProviderFromUrl (providerOrUrl: providers.Provider | string): RootProviderName | undefined {
  let url
  if (providerOrUrl instanceof providers.Provider) {
    url = getRpcUrlFromProvider(providerOrUrl)
  } else {
    url = providerOrUrl
  }

  const entries = Object.entries(RootProviderName)
  for (const [key, value] of entries) {
    if (url.includes(value)) {
      return RootProviderName[key as keyof typeof RootProviderName]
    }
  }
}

async function isCallErrorAlchemy (providerOrUrl: providers.Provider | string): Promise<RootProviderName | undefined> {
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

export default getRpcRootProviderName
