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

let enabledTokens = ['USDC', 'USDT', 'DAI', 'MATIC', 'ETH', 'WBTC', 'HOP', 'SNX']
let enabledChains = ['ethereum', 'gnosis', 'polygon', 'arbitrum', 'optimism', 'nova']

if (isGoerli) {
  enabledTokens = ['USDC', 'ETH', 'HOP']
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
    optimism: 10,
    arbitrum: 20,
    polygon: 30,
    gnosis: 5,
    nova: 20
  },
  optimism: {
    ethereum: 1,
    arbitrum: 1,
    polygon: 5,
    gnosis: 1,
    nova: 1
  },
  arbitrum: {
    ethereum: 1,
    optimism: 1,
    polygon: 5,
    gnosis: 1,
    nova: 1
  },
  polygon: {
    ethereum: 15,
    optimism: 15,
    arbitrum: 15,
    gnosis: 15,
    nova: 15
  },
  gnosis: {
    ethereum: 5,
    optimism: 5,
    arbitrum: 5,
    polygon: 5,
    nova: 5
  },
  nova: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 5,
    gnosis: 1
  },
  linea: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 5,
    gnosis: 1
  },
  base: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 5,
    gnosis: 1
  },
  scroll: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 5,
    gnosis: 1
  }
}
