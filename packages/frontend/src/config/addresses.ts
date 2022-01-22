import { mainnetAddresses, mainnetNetworks } from './mainnet'
import { addresses as kovanAddresses, networks as kovanNetworks } from './kovan'
import { addresses as goerliAddresses, networks as goerliNetworks } from './goerli'
import { Slug } from '@hop-protocol/sdk'

const reactAppNetwork = process.env.REACT_APP_NETWORK || Slug.mainnet
let hopAppNetwork = reactAppNetwork
if (reactAppNetwork === Slug.staging) {
  hopAppNetwork = Slug.mainnet
}
let addresses = kovanAddresses
let networks = kovanNetworks
const isMainnet = hopAppNetwork === Slug.mainnet

if (isMainnet) {
  addresses = mainnetAddresses
  networks = mainnetNetworks
} else if (hopAppNetwork === Slug.goerli) {
  addresses = goerliAddresses
  networks = goerliNetworks
}

let enabledTokens: string | string[] | undefined = process.env.REACT_APP_ENABLED_TOKENS
if (enabledTokens) {
  enabledTokens = enabledTokens.split(',').map(x => x.trim())
  const filteredAddresses: { [key: string]: any } = {}
  for (const enabledToken of enabledTokens) {
    if (addresses.tokens[enabledToken]) {
      filteredAddresses[enabledToken] = addresses.tokens[enabledToken]
    }
  }
  addresses.tokens = filteredAddresses
}

// TODO: mv to src/config/networks
let enabledChains: string | string[] | undefined = process.env.REACT_APP_ENABLED_CHAINS
if (enabledChains) {
  enabledChains = enabledChains.split(',').map(x => x.trim())
  const filteredNetworks: { [key: string]: any } = {}
  for (const enabledChain of enabledChains) {
    if (networks[enabledChain]) {
      filteredNetworks[enabledChain] = networks[enabledChain]
    }
  }
  networks = filteredNetworks
}

if (process.env.NODE_ENV !== 'test') {
  console.log(`
    __  __
   / / / /___  ____
  / /_/ / __ \\/ __ \\
 / __  / /_/ / /_/ /
/_/ /_/\\____/ .___/
           /_/

`)
  console.log('Welcome 🐰')
  console.debug('ui version:', process.env.REACT_APP_GIT_SHA)
  console.debug('config hop app network:', hopAppNetwork)
  console.debug('config chains (networks):', networks)
  console.debug('config addresses:', addresses.tokens)
}

const blocknativeDappid = process.env.REACT_APP_BNC_DAPP_ID
const fortmaticApiKey = process.env.REACT_APP_FORTMATIC_KEY

export {
  addresses,
  reactAppNetwork,
  hopAppNetwork,
  networks,
  isMainnet,
  blocknativeDappid,
  fortmaticApiKey,
}
