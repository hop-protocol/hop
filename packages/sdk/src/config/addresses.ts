type HopAddresses = {
  tokens: {
    [key: string]: {
      [key: string]: {
        [key: string]: string
      }
    }
  }
}

const synthDemoTokens = {}

const demoTokens = {
  USDC: {
    ethereum: {
      l1CanonicalToken: '0x7326510Cf9Ae0397dbBaF37FABba54f0A7b8D100',
      l1Bridge: '0xe31a40e28888BbFF75a7f433f25863F9893a7cd4'
    },
    xdai: {
      l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
      l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
      l2CanonicalToken: '0x452AED3fdB2E83A1352624321629180aB1489Dd0',
      l2Bridge: '0x0116f7Cc707486def830e8B5FbEEE13A237D2A08',
      l2HopBridgeToken: '0x1E3cC52c68a9710012a88AD985a4EE9E3f54D6D1',
      l2AmmWrapper: '0xbD9709B155CbC948aB34347737da9f5228F0F596',
      l2SaddleSwap: '0x60fe7297D746015B5394188Ea74dD92660E04Ef2',
      l2SaddleLpToken: '0x6B93D24F67a15e90B5f9b28d65BD08369557b312',
      l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
      l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
      canonicalBridgeMaxPerTx: '10000'
    },
    optimism: {
      l1CanonicalBridge: '0xf8099DD44375Fdbb70D286af0fFCd46bA4B193dF',
      l2CanonicalBridge: '0x82784078a7a8A1697BcCe5E07896C6a553846Bd5',
      l2CanonicalToken: '0xd4740F9cE3149b657D2457B6Ef29F953c2FcB479',
      l2Bridge: '0xc4fdda794DF56acCE772ABdcB2609Da8aF3650Cc',
      l2HopBridgeToken: '0xd945fdaC6Aa399c695BA9bAF66929dE958aE89FC',
      l2AmmWrapper: '0x1E99A04F2ed8AFC141cC4446BFebDe848E4EA3eF',
      l2SaddleSwap: '0x1dfA08a75F1e3f20386B1Dc17E538e5A0b24c792',
      l2SaddleLpToken: '0x2bd5a75cfe8BB6ac23b992Ca35Dea03ee14F76E3'
    }
  },
  DAI: {
    ethereum: {
      l1CanonicalToken: '0x436e3FfB93A4763575E5C0F6b3c97D5489E050da',
      l1Bridge: '0x0b736f4d94fc1d37CD7593B39F45AA0B0A0Cf7d2'
    },
    xdai: {
      l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
      l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
      l2CanonicalToken: '0x6D2d8B29d92cab87a273e872FcC4650A64116283',
      l2Bridge: '0xEEfB1dF6868cCCa9Bf035D2fc46Ae92C8e48cc5C',
      l2HopBridgeToken: '0x3Af44C0189C2F9689695A47ab4B7eeb1A4fD6D22',
      l2AmmWrapper: '0xee8400C7fb17AE9c22A829F24F1D338B69Ece313',
      l2SaddleSwap: '0x7FF1448D0DAEa1DFCb181d41DE65e302630D2576',
      l2SaddleLpToken: '0xD71e5a4c4FF43A415ECC50C223E32a838eC2AaE9',
      l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
      l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
      canonicalBridgeMaxPerTx: '10000'
    },
    optimism: {
      l1CanonicalBridge: '0xf8099DD44375Fdbb70D286af0fFCd46bA4B193dF',
      l2CanonicalBridge: '0x82784078a7a8A1697BcCe5E07896C6a553846Bd5',
      l2CanonicalToken: '0x43AF508997d3b33555b3Cdc093a94b5DED06e306',
      l2Bridge: '0xc44E388abe0EC188A97B112C2F492a8Fd00a9A1E',
      l2HopBridgeToken: '0x720d42ac91109d5780F418c927ee045487cE3450',
      l2AmmWrapper: '0xaD33e2E73Fde9D4B8dAeDB957D5e8525aF3Fa553',
      l2SaddleSwap: '0xB91E5AC68DFf69a41905c48A1BAac3ca8BE7C7a3',
      l2SaddleLpToken: '0x518C1A4A882125c8EFEeA589C60cB924b5Df561c'
    }
  }
}

export const addresses: HopAddresses = {
  tokens: {
    ...synthDemoTokens,
    ...demoTokens
  }
}

export const chains: any = {
  ethereum: {
    name: 'Kovan',
    chainId: '42',
    rpcUrl: 'https://kovan.rpc.hop.exchange',
    explorerUrl: 'https://kovan.etherscan.io/'
  },
  arbitrum: {
    name: 'Arbitrum',
    chainId: '212984383488152',
    rpcUrl: 'https://kovan4.arbitrum.io/rpc',
    explorerUrl: 'https://explorer.offchainlabs.com/#/'
  },
  optimism: {
    name: 'Optimism',
    chainId: '69',
    rpcUrl: 'https://kovan.optimism.io',
    explorerUrl:
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fkovan.optimism.io'
  },
  xdai: {
    name: 'xDai',
    chainId: '77',
    rpcUrl: 'https://sokol.poa.network',
    explorerUrl: 'https://blockscout.com/poa/sokol/'
  },
  polygon: {
    name: 'Polygon',
    chainId: '80001',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://explorer-mumbai.maticvigil.com/'
  }
}

export const metadata: any = {
  tokens: {
    DAI: {
      symbol: 'DAI',
      name: 'DAI Stablecoin',
      decimals: 18
    },
    ARB: {
      symbol: 'ARB',
      name: 'ARB Token',
      decimals: 18
    },
    sETH: {
      symbol: 'sETH',
      name: 'Synth ETH',
      decimals: 18
    },
    sBTC: {
      symbol: 'sBTC',
      name: 'Synth BTC',
      decimals: 18
    },
    USDC: {
      symbol: 'USDC',
      name: 'USDC',
      decimals: 18
    },
    WBTC: {
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 18
    }
  }
}
