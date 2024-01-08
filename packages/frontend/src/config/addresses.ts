import { Slug } from '@hop-protocol/sdk'
import { gitRevision } from 'src/config/config'
import { goerliAddresses, goerliNetworks } from 'src/config/goerli'
import { mainnetAddresses, mainnetNetworks } from 'src/config/mainnet'
import { sepoliaAddresses, sepoliaNetworks } from 'src/config/sepolia'

const reactAppNetwork = process.env.REACT_APP_NETWORK || Slug.mainnet
let addresses: any
let networks: any
const isMainnet = reactAppNetwork === Slug.mainnet
const isGoerli = reactAppNetwork === Slug.goerli
const isSepolia = reactAppNetwork === Slug.sepolia

if (isMainnet) {
  addresses = mainnetAddresses
  networks = mainnetNetworks
} else if (isGoerli) {
  addresses = goerliAddresses
  networks = goerliNetworks
} else if (isSepolia) {
  addresses = sepoliaAddresses
  networks = sepoliaNetworks
} else {
  throw new Error(`Invalid network: ${reactAppNetwork}`)
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

const chainsWithConfig = new Set(Object.values(addresses.tokens).map((x: any) => Object.keys(x)).flat())

const deprecatedTokens = (process.env.REACT_APP_DEPRECATED_TOKENS ?? '').split(',')

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
} else {
  const filteredNetworks: { [key: string]: any } = {
    ethereum: networks.ethereum
  }
  for (const chain of chainsWithConfig) {
    filteredNetworks[chain] = networks[chain]
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
  console.debug('ui version:', gitRevision)
  console.debug('config react app network:', reactAppNetwork)
  console.debug('config chains (networks):', networks)
  console.debug('config addresses:', addresses.tokens)
  console.debug('deprecated tokens:', process.env.REACT_APP_DEPRECATED_TOKENS)
}

const blocknativeDappid = process.env.REACT_APP_BNC_DAPP_ID

const stakingRewardsContracts = {
  mainnet: {
    polygon: {
      ETH: '0x7bCeDA1Db99D64F25eFA279BB11CE48E15Fda427', // MATIC
      MATIC: '0x7dEEbCaD1416110022F444B03aEb1D20eB4Ea53f', // MATIC
      DAI: '0x4Aeb0B5B1F3e74314A7Fa934dB090af603E8289b', // MATIC
      USDC: '0x2C2Ab81Cf235e86374468b387e241DF22459A265', // MATIC
      USDT: '0x07932e9A5AB8800922B2688FB1FA0DAAd8341772', // MATIC
    },
    gnosis: {
      ETH: '0xC61bA16e864eFbd06a9fe30Aab39D18B8F63710a', // GNO
      DAI: '0x12a3a66720dD925fa93f7C895bC20Ca9560AdFe7', // GNO
      USDC: '0x5D13179c5fa40b87D53Ff67ca26245D3D5B2F872', // GNO
      USDT: '0x2C2Ab81Cf235e86374468b387e241DF22459A265', // GNO
    },
    optimism: {
      SNX: '0x09992Dd7B32f7b35D347DE9Bdaf1919a57d38E82', // OP rewards
      sUSD: '0x25fb92e505f752f730cad0bd4fa17ece4a384266', // OP rewards
      rETH: '0x266e2dc3C4c59E42AA07afeE5B09E964cFFe6778', // RPL rewards
    },
    arbitrum: {
      rETH: '0x3D4cAD734B464Ed6EdCF6254C2A3e5fA5D449b32', // RPL rewards
    },
    linea: {
      ETH: '0xa50395bdEaca7062255109fedE012eFE63d6D402', // WETH rewards
    }
  }
}

// keep addresses lowercased since they are keys
export const stakingRewardTokens = {
  mainnet: {
    polygon: {
      '0x7bceda1db99d64f25efa279bb11ce48e15fda427': 'MATIC',
      '0x7deebcad1416110022f444b03aeb1d20eb4ea53f': 'MATIC',
      '0x4aeb0b5b1f3e74314a7fa934db090af603e8289b': 'MATIC',
      '0x2c2ab81cf235e86374468b387e241df22459a265': 'MATIC',
      '0x07932e9a5ab8800922b2688fb1fa0daad8341772': 'MATIC',
    },
    gnosis: {
      '0xc61ba16e864efbd06a9fe30aab39d18b8f63710a': 'GNO',
      '0x12a3a66720dd925fa93f7c895bc20ca9560adfe7': 'GNO',
      '0x5d13179c5fa40b87d53ff67ca26245d3d5b2f872': 'GNO',
      '0x2c2ab81cf235e86374468b387e241df22459a265': 'GNO',
    },
    optimism: {
      '0x09992dd7b32f7b35d347de9bdaf1919a57d38e82': 'OP',
      '0x25fb92e505f752f730cad0bd4fa17ece4a384266': 'OP',
      '0x266e2dc3c4c59e42aa07afee5b09e964cffe6778': 'RPL',
    },
    arbitrum: {
      '0x3d4cad734b464ed6edcf6254c2a3e5fa5d449b32': 'RPL'
    },
    linea: {
      '0xa50395bdeaca7062255109fede012efe63d6d402': 'WETH'
    }
  }
}

// keep addresses lowercased since they are keys
const hopStakingRewardsContracts = {
  mainnet: {
    polygon: {
      ETH: '0xAA7b3a4A084e6461D486E53a03CF45004F0963b7',
      USDC: '0x7811737716942967Ae6567B26a5051cC72af550E',
      DAI: '0xd6dC6F69f81537Fe9DEcc18152b7005B45Dc2eE7',
      USDT: '0x297E5079DF8173Ae1696899d3eACD708f0aF82Ce'
    },
    gnosis: {
      ETH: '0x712F0cf37Bdb8299D0666727F73a5cAbA7c1c24c',
      USDC: '0x636A7ee78faCd079DaBC8f81EDA1D09AA9D440A7',
      DAI: '0xBF7a02d963b23D84313F07a04ad663409CEE5A92',
      USDT: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1'
    },
    arbitrum: {
      ETH: '0x755569159598f3702bdD7DFF6233A317C156d3Dd',
      USDC: '0xb0CabFE930642AD3E7DECdc741884d8C3F7EbC70',
      DAI: '0xd4D28588ac1D9EF272aa29d4424e3E2A03789D1E',
      USDT: '0x9Dd8685463285aD5a94D2c128bda3c5e8a6173c8',
      MAGIC: '0x4e9840f3C1ff368a10731D15c11516b9Fe7E1898'
    },
    optimism: {
      ETH: '0x95d6A95BECfd98a7032Ed0c7d950ff6e0Fa8d697',
      USDC: '0xf587B9309c603feEdf0445aF4D3B21300989e93a',
      DAI: '0x392B9780cFD362bD6951edFA9eBc31e68748b190',
      USDT: '0xAeB1b49921E0D2D96FcDBe0D486190B2907B3e0B',
      SNX: '0x25a5A48C35e75BD2EFf53D94f0BB60d5A00E36ea',
      sUSD: '0x2935008ee9943f859c4fbb863c5402ffc06f462e'
    },
    nova: {
      MAGIC: '0xeB35Dac45077319042D62a735aa0f9eDD1F01Fa6'
    },
    base: {
      ETH: '0x12e59C59D282D2C00f3166915BED6DC2F5e2B5C7',
      USDC: '0x7aC115536FE3A185100B2c4DE4cb328bf3A58Ba6'
    }
  },
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
    },
    // TODO: add Base
  }
}

export {
  addresses,
  reactAppNetwork,
  networks,
  isMainnet,
  isGoerli,
  blocknativeDappid,
  stakingRewardsContracts,
  hopStakingRewardsContracts,
  deprecatedTokens
}
