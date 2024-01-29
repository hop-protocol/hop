const { override } = require('customize-cra')
const { mainnet, goerli, sepolia } = require('@hop-protocol/core/networks')
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')

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

const networks = [mainnet, goerli, sepolia]
for (const network in networks) {
  for (const chain in networks[network]) {
    const { publicRpcUrl, fallbackPublicRpcUrls, subgraphUrl } = networks[network][chain]
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

const cspOptions = {
  enabled: true,
  hashingMethod: 'sha256',
  hashEnabled: {
    "default-src": false,
    "child-src": false,
    "script-src": false,
    "connect-src": false,
    "img-src": false,
    "frame-src": false,
    "style-src": false,
    "font-src": false,
    "object-src": false,
    "form-action": false,
    "manifest-src": false,
    "base-uri": false,
    "block-all-mixed-content": false
  },
  nonceEnabled: {
    "default-src": false,
    "child-src": false,
    "script-src": false,
    "connect-src": false,
    "img-src": false,
    "frame-src": false,
    "style-src": false,
    "font-src": false,
    "object-src": false,
    "form-action": false,
    "manifest-src": false,
    "base-uri": false,
    "block-all-mixed-content": false
  },
}

function addCspHtmlWebpackPlugin(config) {
  // note: this may also require another module "html-webpack-plugin" to work,
  // see https://github.com/jantimon/html-webpack-plugin/issues/1068#issuecomment-454840740
  config.plugins.push(new CspHtmlWebpackPlugin(cspConfigPolicy, cspOptions))

  return config
}

function customWebpackConfig(config) {
  const rules = config.module.rules.find(r => r.oneOf).oneOf;
  const babelRule = rules.find(r => r.loader && r.loader.includes('babel-loader'));

  if (babelRule) {
    babelRule.exclude = /node_modules/;
  }

  // Continue with other custom modifications if necessary

  return config;
}

module.exports = {
  // The function to use to create a webpack dev server configuration when running the development
  // server with 'npm run start' or 'yarn start'.
  // Example: set the dev server to use a specific certificate in https.
  devServer: function (configFunction) {
    // Return the replacement function for create-react-app to use to generate the Webpack
    // Development Server config. "configFunction" is the function that would normally have
    // been used to generate the Webpack Development server config - you can use it to create
    // a starting configuration to then modify instead of having to create a config from scratch.
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost)

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      }

      // Return your customised Webpack Development Server config.
      return config
    }
  },

  webpack: override(customWebpackConfig, addCspHtmlWebpackPlugin)
}
