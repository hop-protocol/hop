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
      l1Bridge: '0xC3AfC5D83d99eac3450aC9801cd6dd839d93f962'
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
      l1CanonicalBridge: '0xA6e9F1409fe85c84CEACD5936800A12d721009cE',
      l2CanonicalBridge: '0x6d2f304CFF4e0B67dA4ab38C6A5C8184a2424D05',
      l2CanonicalToken: '0x57eaeE3D9C99b93D8FD1b50EF274579bFEC8e14B',
      l2Bridge: '0x8574f2DdE27E69032080Cc0C06Cf364d16C27F49',
      l2HopBridgeToken: '0xABc55F70c660b3BbEeB9C0cD2ca1353115cd0D35',
      l2UniswapWrapper: '0x2028dc304c14510a74F79d4f4FD9aFC628BFc724',
      uniswapRouter: '0xD8581750B2a8ea41Ff19723f627f709C50C2Ba97',
      uniswapFactory: '0x6C5bA814b2C4c279EB47d145b33AC1FdeeEe687f',
      uniswapExchange: '0x48b973a18025200aA9B0c07788D6025FaE801760'
    },
    xdai: {
      l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
      l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
      l2CanonicalToken: '0x714983a8Dc3329bf3BeB8F36b49878CF944E5A3B',
      l2Bridge: '0xd619ad47beF3EFB4641Ec4a38806d969C8B7a6aa',
      l2HopBridgeToken: '0x653bE9988FdF46a0843c09B2B30978c6206d6150',
      l2UniswapWrapper: '0x4b3d9e4DCba143E781621B6FaE9eaA9d1e7274E9',
      uniswapRouter: '0x8a7CE4E1d2F2dcEC1c2c225751E7cE8193CE7a3A',
      uniswapFactory: '0x63d1892fC72A1F2daA744fA40BAf17E7063E1794',
      uniswapExchange: '0xD143c76EF9b8FB05bd01C3b439e48b0B4ab0EDc8',
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
