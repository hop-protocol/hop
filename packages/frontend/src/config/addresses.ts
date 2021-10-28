import { addresses as mainnetAddresses, networks as mainnetNetworks } from './mainnet'
import { addresses as kovanAddresses, networks as kovanNetworks } from './kovan'
import { addresses as goerliAddresses, networks as goerliNetworks } from './goerli'

const reactAppNetwork = process.env.REACT_APP_NETWORK || 'kovan'
let network = reactAppNetwork
if (reactAppNetwork === 'staging') {
  network = 'mainnet'
}
let addresses = kovanAddresses
let networks = kovanNetworks
const isMainnet = network === 'mainnet'

if (isMainnet) {
  addresses = mainnetAddresses
  networks = mainnetNetworks
} else if (network === 'goerli') {
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
  console.debug('config network:', network)
  console.debug('config chains:', networks)
  console.debug('config addresses:', addresses.tokens)
}

export { addresses, reactAppNetwork, network, networks, isMainnet }
export const blocknativeDappid = process.env.REACT_APP_BNC_DAPP_ID || '328621b8-952f-4a86-bd39-724ba822d416'
export const fortmaticApiKey = 'pk_live_AB6F615F133473CA'
export const portisDappId = 'fbde3745-1363-4ae4-a517-00d98ab2dfbc'
