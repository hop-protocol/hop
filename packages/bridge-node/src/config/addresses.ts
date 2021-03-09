export const rpcUrls: { [key: string]: string } = {
  kovan: 'https://kovan.rpc.hop.exchange',
  optimism: 'https://kovan.optimism.rpc.hop.exchange',
  arbitrum: 'https://kovan3.arbitrum.io/rpc',
  xdai: 'https://sokol.poa.network'
}

export const networkIds: { [key: string]: string } = {
  kovan: '42',
  optimism: '69',
  arbitrum: '79377087078960',
  xdai: '77'
}

export const tokens: {
  [key: string]: { [key: string]: { [key: string]: string } }
} = {
  DAI: {
    kovan: {
      l1CanonicalToken: '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9',
      l1Bridge: '0xB4585D433075bdF1B503C1e5ca8431999F7042C6'
    },
    arbitrum: {
      l1CanonicalBridge: '0xE681857DEfE8b454244e701BA63EfAa078d7eA85',
      l2CanonicalToken: '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9',
      l2Bridge: '0x9a57ED0207EE95Aa580253dBaef9FDf4A478FcBc',
      l2HopBridgeToken: '0xac9db0707bBC106B1Acd9CCDc07EdB9ED190108b',
      uniswapRouter: '0x5B64A7A5c5C4F61e8bEABB721c5988016D9b1587',
      uniswapFactory: '0x5006BB088D06dEBA783a54769Bf8a883bBaDDA6a',
      uniswapExchange: '0x3cb14029f46D7A4Ee346A2b1F61C8e5bACD86341',
      arbChain: '0x2e8aF9f74046D3E55202Fcfb893348316B142230'
    },
    /*
    optimism: {
      l1CanonicalBridge: '0xA6e9F1409fe85c84CEACD5936800A12d721009cE',
      l2CanonicalToken: '0x57eaeE3D9C99b93D8FD1b50EF274579bFEC8e14B',
      l2Bridge: '0x6d2f304CFF4e0B67dA4ab38C6A5C8184a2424D05',
      uniswapRouter: '0x3C67B82D67B4f31A54C0A516dE8d3e93D010EDb3',
      uniswapFactory: '0x3e4CFaa8730092552d9425575E49bB542e329981',
      uniswapExchange: '0x65F72DF8a668BC6272B059BB7F53ADc91066540C'
    },
    */
    xdai: {
      l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
      l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
      l2CanonicalToken: '0x714983a8Dc3329bf3BeB8F36b49878CF944E5A3B',
      l2Bridge: '0x20460c559C5e11F9936455E038ff5dbB731C0A50',
      l2HopBridgeToken: '0x5006BB088D06dEBA783a54769Bf8a883bBaDDA6a',
      uniswapRouter: '0x9a57ED0207EE95Aa580253dBaef9FDf4A478FcBc',
      uniswapFactory: '0x5B64A7A5c5C4F61e8bEABB721c5988016D9b1587',
      uniswapExchange: '0xc95EB7acC44cdFD54693C5b82e873C26Ab1Efc89',
      l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
      l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560'
    }
  },
  ARB: {
    kovan: {
      l1CanonicalToken: '0xE41d965f6e7541139f8D9F331176867FB6972Baf',
      l1Bridge: '0x0E5a812ebA2b17B2Aea3E50Ed05518668839afa9'
    },
    arbitrum: {
      l1CanonicalBridge: '0xE681857DEfE8b454244e701BA63EfAa078d7eA85',
      l2CanonicalToken: '0xE41d965f6e7541139f8D9F331176867FB6972Baf',
      l2Bridge: '0xAb00C81e9d90c5c068218FF1eaA8264FcDf5f5fB',
      l2HopBridgeToken: '0x427aA184ce8bDC92c0B4dDf19A5b9A3D5B7F45BC',
      uniswapRouter: '0x653616AFcD6f4D645d8d5A08b3F74e140f981b00',
      uniswapFactory: '0x880046478C059643B6624452Af203F5CC478E3AC',
      uniswapExchange: '0x67ef9648f7c45087fCc85eA7b2F1fe79f07D52be'
    }
  }
}
