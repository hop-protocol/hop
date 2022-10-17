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

const stakingRewardsContracts = {
  mainnet: {
    polygon: {
      ETH: '0x7bCeDA1Db99D64F25eFA279BB11CE48E15Fda427',
      MATIC: '0x7dEEbCaD1416110022F444B03aEb1D20eB4Ea53f',
      DAI: '0x4Aeb0B5B1F3e74314A7Fa934dB090af603E8289b',
      USDC: '0x2C2Ab81Cf235e86374468b387e241DF22459A265',
      USDT: '0x07932e9A5AB8800922B2688FB1FA0DAAd8341772',
    },
    gnosis: {
      ETH: '0xC61bA16e864eFbd06a9fe30Aab39D18B8F63710a',
      DAI: '0x12a3a66720dD925fa93f7C895bC20Ca9560AdFe7',
      USDC: '0x5D13179c5fa40b87D53Ff67ca26245D3D5B2F872',
      USDT: '0x2C2Ab81Cf235e86374468b387e241DF22459A265',
    },
  }
}

const rewardTokenAddresses = {
  mainnet: {
    WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    GNO: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
  }
}

const hopStakingRewardsContracts = {
  goerli: {
    polygon: {
      ETH: '0x370A51222E99274bC8Db343C3163CFe446B355F7',
      USDC: '0x07C592684Ee9f71D58853F9387579332d471b6Ca'
    },
    arbitrum: {
      ETH: '0x9142C0C1b0ea0008B0b6734E1688c8355FB93b62',
      USDC: '0x740913C318dE0B5DF0fF9103a9Be5B4ee7d83fE2'
    },
    optimism: {
      ETH: '0xd691E3f40692a28f0b8090D989cC29F24B59f945',
      USDC: '0xFCd39f8d53A74f99830849331AB433bBCe0e28E0'
    }
  }
}

export {
  addresses,
  reactAppNetwork,
  hopAppNetwork,
  networks,
  isMainnet,
  blocknativeDappid,
  fortmaticApiKey,
  stakingRewardsContracts,
  rewardTokenAddresses,
  hopStakingRewardsContracts,
}
