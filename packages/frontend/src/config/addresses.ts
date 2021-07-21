import {
  addresses as mainnetAddresses,
  networks as mainnetNetworks
} from './mainnet'
import { addresses as kovanAddresses, networks as kovanNetworks } from './kovan'
import {
  addresses as goerliAddresses,
  networks as goerliNetworks
} from './goerli'

const network = process.env.REACT_APP_NETWORK || 'kovan'
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

console.log('config network:', network)
console.log('config addresses:', addresses.tokens)

let enabledTokens : string | string[] | undefined = process.env.REACT_APP_ENABLED_TOKENS
if (enabledTokens) {
  enabledTokens = enabledTokens.split(',').map(x => x.trim())
  const filteredAddresses : {[key: string]: any} = {}
  for (const enabledToken of enabledTokens) {
    filteredAddresses[enabledToken] = addresses.tokens[enabledToken]
  }
  addresses.tokens = filteredAddresses
}

export { addresses, network, networks, isMainnet }
export const blocknativeDappid = '328621b8-952f-4a86-bd39-724ba822d416'
export const infuraKey = '8e4fe7af961f48a1958584ec36742b44'
export const fortmaticApiKey = 'pk_live_AB6F615F133473CA'
export const portisDappId = 'fbde3745-1363-4ae4-a517-00d98ab2dfbc'
