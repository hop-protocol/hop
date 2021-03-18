export const rpcUrls: { [key: string]: string } = {
  kovan: 'https://kovan.rpc.hop.exchange',
  optimism: 'https://kovan.optimism.io',
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
  [key: string]: {
    [key: string]: {
      [key: string]: string
    }
  }
} = {
  DAI: {
    kovan: {
      l1CanonicalToken: '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9',
      l1Bridge: '0x8C295068Cd136C348F90f9f31C85A5c61Ed490Bc'
    },
    /*
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
		*/
    optimism: {
      l1CanonicalBridge: '0xC1e7Be0E1aDD345afB2485aA5E774cD79cBbbBf5',
      l2CanonicalBridge: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
      l2CanonicalToken: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
      l2Bridge: '0xd6935d3FE65f804e54a8e0d0A0F8793f0aC196Ff',
      l2HopBridgeToken: '0x761ac04A47076eadf2BfAF545e2B101C8417498e',
      l2UniswapWrapper: '0x6523C434ce2a4AAf168FD59a1d6074772C9a15bE',
      uniswapRouter: '0x8D65D4160559493b0a687ED5Ae39dcce88cB5cFc',
      uniswapFactory: '0x6523C434ce2a4AAf168FD59a1d6074772C9a15bE',
      uniswapExchange: '0xBEa657cb5BD947811694882A821F7EC08370c252'
    },
    xdai: {
      l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
      l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
      l2CanonicalToken: '0x714983a8Dc3329bf3BeB8F36b49878CF944E5A3B',
      l2Bridge: '0xAD5f66C982EaC97b3c4A4F4fe84bb7F10294d569',
      l2HopBridgeToken: '0x0410eB12A8E3AA88C1048276d31Ae0F0AA83aeA7',
      l2UniswapWrapper: '0x2Bc2eb99dB79DA6F2cEE57014501ea8724f841e2',
      uniswapRouter: '0x1Df061d3D0bFeE57db7851099d72751C7C6697A9',
      uniswapFactory: '0xc718BdbdDc3050Cf772c0Ec43f11bfAe69741e30',
      uniswapExchange: '0xBc7ff2f9C9b1dF80E98F67F6f46e46e12A0ebBd4',
      l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
      l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560'
    }
  }
  /*
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
	*/
}
