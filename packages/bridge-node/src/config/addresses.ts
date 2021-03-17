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
  [key: string]: { [key: string]: { [key: string]: string } }
} = {
  DAI: {
    kovan: {
      l1CanonicalToken: '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9',
      l1Bridge: '0xbFE287FD6d9a856b10281083c0B03160998F51d9'
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
      l1CanonicalBridge: '0xC76F55Dd0aeF08e46a454DCbb4fAA940d4450C72',
      l2CanonicalBridge: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
      l2CanonicalToken: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
      l2Bridge: '0xcdEFB10800763eeC078e829aa8cC15C97E784bCD',
      l2HopBridgeToken: '0xe0a010115Cad71C25217cDaa525ed6F7637D5c6F',
      l2UniswapWrapper: '0x8889DBf65B2a195Ad2325403363b6028EFa2Bd65',
      uniswapRouter: '0x4bC4168e2f6108D29D7E42D5114740161004284d',
      uniswapFactory: '0x54F19216ab6b2D8A33a4F7dBE54873304F20dC8d',
      uniswapExchange: '0x30EC5bA956114F8316AF690C67b939d8D547e61D'
    },
    xdai: {
      l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
      l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
      l2CanonicalToken: '0x714983a8Dc3329bf3BeB8F36b49878CF944E5A3B',
      l2Bridge: '0xdF9E0A8aFF08B00cA062d44e999A9d945586aD77',
      l2HopBridgeToken: '0x2e1EC45f7Bb01905CAE6aB7e232BA2093E276786',
      l2UniswapWrapper: '0x0d253e4E94055D63B32A845b5CFBEEB65420bAD2',
      uniswapRouter: '0xbFE287FD6d9a856b10281083c0B03160998F51d9',
      uniswapFactory: '0x8f7b441aF35018E4EDA38b4C472b8eEa6BFF94EE',
      uniswapExchange: '0x07b3f4D4BaF93Ee224aA36A12DC016966fAA312F',
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
