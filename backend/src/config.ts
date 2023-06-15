require('dotenv').config()

export const network = process.env.NETWORK || 'mainnet'
export const isGoerli = network === 'goerli'
export const port = Number(process.env.PORT || 3000)
export const ipRateLimitReqPerSec = Number(process.env.IP_RATE_LIMIT_REQ_PER_SEC || 100)
export const ipRateLimitWindowMs = Number(process.env.IP_RATE_LIMIT_WINDOW_MS || 1 * 1000)
export const postgresConfig = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DBNAME,
  password: process.env.POSTGRES_PASS,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  maxConnections: process.env.POSTGRES_MAX_CONNECTIONS ? parseInt(process.env.POSTGRES_MAX_CONNECTIONS, 10) : 10
}

let enabledTokens = ['USDC', 'USDT', 'DAI', 'MATIC', 'ETH', 'WBTC', 'HOP', 'SNX', 'sUSD', 'rETH']
let enabledChains = ['ethereum', 'gnosis', 'polygon', 'arbitrum', 'optimism', 'nova']

if (isGoerli) {
  enabledTokens = ['USDC', 'ETH', 'HOP', 'USDT', 'DAI', 'UNI']
  enabledChains = ['ethereum', 'polygon', 'optimism', 'arbitrum', 'linea', 'base']
}

export { enabledTokens, enabledChains }

export const rpcUrls = {
  gnosis: process.env.GNOSIS_RPC,
  polygon: process.env.POLYGON_RPC,
  arbitrum: process.env.ARBITRUM_RPC,
  optimism: process.env.OPTIMISM_RPC,
  ethereum: process.env.ETHEREUM_RPC,
  nova: process.env.NOVA_RPC,
  linea: process.env.LINEA_RPC,
  base: process.env.BASE_RPC,
  scroll: process.env.SCROLL_RPC
}

export const transferTimes = {
  ethereum: {
    optimism: 2,
    arbitrum: 10,
    polygon: 20,
    gnosis: 5,
    nova: 10
  },
  optimism: {
    ethereum: 25,
    arbitrum: 25,
    polygon: 25,
    gnosis: 25,
    nova: 25
  },
  arbitrum: {
    ethereum: 12,
    optimism: 12,
    polygon: 12,
    gnosis: 12,
    nova: 12
  },
  polygon: {
    ethereum: 60,
    optimism: 60,
    arbitrum: 60,
    gnosis: 60,
    nova: 60
  },
  gnosis: {
    ethereum: 4,
    optimism: 4,
    arbitrum: 4,
    polygon: 4,
    nova: 4
  },
  nova: {
    ethereum: 12,
    optimism: 12,
    arbitrum: 12,
    polygon: 12,
    gnosis: 12
  },
  linea: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 1,
    gnosis: 1
  },
  base: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 1,
    gnosis: 1
  },
  scroll: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 1,
    gnosis: 1
  }
}

// note: keep the addresses lowercased
export const integrations : Record<string, string> = {
  '0xc30141b657f4216252dc59af2e7cdb9d8792e1b0': 'socket', // socket registry
  '0x8b14984de0ddd2e080d8679febe2f5c94b975af8': 'socket', // socket registry
  '0xc9b6f5eeabb099bbbfb130b78249e81f70efc946': 'socket', // socket registry
  '0x3a23f943181408eac424116af7b7790c94cb97a5': 'socket', // socket gateway
  '0x362fa9d0bca5d19f743db50738345ce2b40ec99f': 'lifi',
  '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae': 'lifi',
  '0x82e0b8cdd80af5930c4452c684e71c861148ec8a': 'metamask',
  '0xf26055894aeaae23d136defaa355a041a43d7dfd': 'chainhop',
  '0xf762c3fc745948ff49a3da00ccdc6b755e44305e': 'chainhop',
  '0xf80dd9cef747710b0bb6a113405eb6bc394ce050': 'chainhop',
  '0x696c91cdc3e79a74785c2cdd07ccc1bf0bc7b788': 'chainhop',
  '0x777777773491ff5cef6bb758f3baa9d70886909c': 'viaprotocol' // via protocol
}
