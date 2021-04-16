export const addresses = {
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
    }
  }
}

export const networks: any = {
  ethereum: {
    networkId: '42',
    rpcUrl: 'https://kovan.rpc.hop.exchange'
  },
  /*
  arbitrum: {
    networkId: '79377087078960',
    rpcUrl: 'https://kovan3.arbitrum.io/rpc',
    explorerUrl: 'https://explorer.offchainlabs.com/#/'
  },
  */
  /*
  optimism: {
    networkId: '69',
    rpcUrl: 'https://kovan.optimism.io',
  },
  */
  xdai: {
    networkId: '77',
    rpcUrl: 'https://sokol.poa.network'
  }
}
