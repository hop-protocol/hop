import getRpcUrlFromProvider from './getRpcUrlFromProvider'
import { providers } from 'ethers'

function isAlchemy (providerOrUrl: providers.Provider | string): boolean {
  let url
  if (providerOrUrl instanceof providers.Provider) {
    url = getRpcUrlFromProvider(providerOrUrl)
  } else {
    url = providerOrUrl
  }

  return url.includes('alchemy.com')
}

export default isAlchemy
