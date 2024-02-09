import dotenv from 'dotenv'
import path from 'path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import { goerli, mainnet, sepolia } from '@hop-protocol/core/networks'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

dotenv.config()

const scriptSrc = new Set([
  "'self'",
  "'unsafe-inline'",
  "https://*.googletagmanager.com",
  "https://*.google.com",
  "https://*.gstatic.com",
  "https://*.google-analytics.com",
  "https://*.netlify.app",
  "resource:",
  "blob:"
])

const connectSrc = new Set([
  "'self'",
  "http://localhost:*",
  "ws://localhost:*",
  "https://*.google.com",
  "https://*.gstatic.com",
  "https://*.google-analytics.com",
  "https://*.hop.exchange",
  "https://*.rpc.hop.exchange",
  "https://*.authereum.com",
  "https://*.netlify.app",
  "wss://*.authereum.com",
  "https://gist.githubusercontent.com",
  "https://raw.githubusercontent.com",
  "https://*.googleusercontent.com",
  "https://*.coinbase.com",
  "https://*.walletlink.org",
  "https://*.walletconnect.org",
  "https://*.walletconnect.com",
  "https://*.arbitrum.io",
  "https://*.optimism.io",
  "https://*.base.org",
  "https://sokol.poa.network",
  "https://rpc.xdaichain.com",
  "https://rpc.gnosischain.com",
  "https://rpc.gnosis.gateway.fm",
  "https://sokol-archive.blockscout.com",
  "https://dai.poa.network",
  "https://xdai.poanetwork.dev",
  "https://xdai-archive.blockscout.com",
  "https://xdai.1hive.org",
  "https://rpc.ankr.com",
  "https://api.thegraph.com",
  "https://gateway.thegraph.com",
  "https://thegraph.goerli.zkevm.consensys.net",
  "wss://rpc.xdaichain.com/wss",
  "wss://rpc.gnosischain.com/wss",
  "wss://xdai.poanetwork.dev/wss",
  "https://rpc-mumbai.maticvigil.com",
  "https://rpc-mainnet.maticvigil.com",
  "https://mainnet.arbitrum.io",
  "https://arb1.arbitrum.io/rpc",
  "https://kovan4.arbitrum.io/rpc",
  "https://kovan.optimism.io",
  "https://mainnet.optimism.io",
  "https://polygon-rpc.com",
  "https://rpc.public.zkevm-test.net",
  "https://matic-testnet-archive-rpc.bwarelabs.com",
  "wss://rpc-mainnet.maticvigil.com/ws",
  "wss://*.blocknative.com",
  "wss://*.walletlink.org",
  "wss://*.walletconnect.org",
  "wss://*.walletconnect.com",
  "wss://*.zksync.io/jsrpc-ws",
  "https://*.infura.io",
  "https://*.quiknode.pro",
  "https://*.tor.us",
  "https://*.alchemyapi.io",
  "https://zksync2-testnet.zksync.dev",
  "https://consensys-zkevm-goerli-prealpha.infura.io",
  "https://rpc.goerli.linea.build",
  "https://rpc.linea.build",
  "https://*.linea.build",
  "https://zksync2-mainnet.zksync.io",
  "https://1rpc.io",
  "https://*.etherscan.io",
  "https://api.rollbar.com",
  "https://*.coingecko.com",
  "https://*.coinpaprika.com",
  "https://*.coincodex.com",
  "http://127.0.0.1:21325",
  "https://api.opensea.io",
  "https://social-auth.hop.exchange",
  "https://hopprotocol.cloudflareaccess.com",
  "https://optimism-fee-refund-api.hop.exchange",
  "https://hop-merkle-rewards-backend.hop.exchange",
  "https://meebits.larvalabs.com",
  "https://meebits.app",
  "https://gateway.pinata.cloud",
  "https://hop.mypinata.cloud",
  "https://ipfs.io",
  "https://gateway.ipfs.io",
  "https://media-exp1.licdn.com"
])

const networks: any[] = [mainnet, goerli, sepolia]
for (const network of networks) {
  for (const chain of Object.values(network)) {
    const { publicRpcUrl, fallbackPublicRpcUrls, subgraphUrl } = chain
    if (publicRpcUrl) {
      connectSrc.add(publicRpcUrl)
    }
    if (Array.isArray(fallbackPublicRpcUrls)) {
      fallbackPublicRpcUrls.forEach((url) => connectSrc.add(url))
    }
    if (subgraphUrl) {
      connectSrc.add(subgraphUrl)
    }
  }
}

const frameSrc = new Set([
  "'self'",
  "http://localhost:*",
  "https://*.google.com",
  "https://*.gstatic.com",
  "https://widget.portis.io",
  "https://x2.fortmatic.com",
  "https://app.tor.us",
  "https://verify.walletconnect.com",
  "https://verify.walletconnect.org",
  "https://connect.trezor.io",
  "chrome-extension://kmendfapggjehodndflmmgagdbamhnfd/u2f-comms.html"
])

const cspConfigPolicy = {
  "default-src": ["'none'"],
  "child-src": ["'self'", "blob:", "https://*.google.com", "https://*.gstatic.com"],
  "script-src": Array.from(scriptSrc),
  "connect-src": Array.from(connectSrc),
  "img-src": ["*", "data:", "blob:"],
  "frame-src": Array.from(frameSrc),
  "style-src": ["*", "'unsafe-inline'"],
  "font-src": ["https://*.gstatic.com"],
  "object-src": ["'none'"],
  "form-action": ["'none'"],
  "manifest-src": ["'self'"],
  "base-uri": ["'none'"],
  "block-all-mixed-content": [";"]
}

function cspPlugin() {
  return {
    name: 'vite-plugin-csp',
    transformIndexHtml(html) {
      // Use the cspConfigPolicy directly to build the CSP string
      const cspString = Object.entries(cspConfigPolicy)
        .map(([directive, sources]) => {
          // Join sources array into a space-separated string
          return `${directive} ${sources.join(' ')}`
        })
        .join('; ')

      // Inject CSP meta tag into the head of the HTML document
      return html.replace(
        '<head>',
        `<head><meta http-equiv="Content-Security-Policy" content="${cspString}">`
      )
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL ?? '/',
  server: {
    port: 3000,
  },

  plugins: [react(), nodePolyfills(), svgr({
    svgrOptions: {
      icon: true,
    },
  }), cspPlugin()],

  define: {
    "process.env.REACT_APP_NETWORK": process.env.REACT_APP_NETWORK ? `"${process.env.REACT_APP_NETWORK}"` : undefined,
    "process.env.REACT_APP_WARNING_ROUTES": process.env.REACT_APP_WARNING_ROUTES ? `"${process.env.REACT_APP_WARNING_ROUTES}"` : undefined,
    "process.env.REACT_APP_DISABLED_ROUTES": process.env.REACT_APP_DISABLED_ROUTES ? `"${process.env.REACT_APP_DISABLED_ROUTES}"` : undefined,
    "process.env.REACT_APP_DISABLED_ROUTES_NO_LIQUIDITY_WARNING_MESSAGE": process.env.REACT_APP_DISABLED_ROUTES_NO_LIQUIDITY_WARNING_MESSAGE ? `"${process.env.REACT_APP_DISABLED_ROUTES_NO_LIQUIDITY_WARNING_MESSAGE}"` : undefined,
    "process.env.REACT_APP_BLOCKLIST_ENABLED": process.env.REACT_APP_BLOCKLIST_ENABLED ? `"${process.env.REACT_APP_BLOCKLIST_ENABLED}"` : undefined,
    "process.env.REACT_APP_ENABLED_TOKENS": process.env.REACT_APP_ENABLED_TOKENS ? `"${process.env.REACT_APP_ENABLED_TOKENS}"` : undefined,
    "process.env.REACT_APP_DEPRECATED_TOKENS": process.env.REACT_APP_DEPRECATED_TOKENS ? `"${process.env.REACT_APP_DEPRECATED_TOKENS}"` : undefined,
    "process.env.REACT_APP_ENABLED_CHAINS": process.env.REACT_APP_ENABLED_CHAINS ? `"${process.env.REACT_APP_ENABLED_CHAINS}"` : undefined,
    "process.env.REACT_APP_BNC_DAPP_ID": process.env.REACT_APP_BNC_DAPP_ID ? `"${process.env.REACT_APP_BNC_DAPP_ID}"` : undefined,
    "process.env.REACT_APP_SHOW_BANNER_MESSAGE": process.env.REACT_APP_SHOW_BANNER_MESSAGE ? `"${process.env.REACT_APP_SHOW_BANNER_MESSAGE}"` : undefined,
    "process.env.REACT_APP_GIT_SHA": process.env.REACT_APP_GIT_SHA ? `"${process.env.REACT_APP_GIT_SHA}"` : undefined,
    "process.env.REACT_APP_DISABLE_NATIVE_ASSET_TRANSFERS": process.env.REACT_APP_DISABLE_NATIVE_ASSET_TRANSFERS ? `"${process.env.REACT_APP_DISABLE_NATIVE_ASSET_TRANSFERS}"` : undefined,
  },

  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
})
