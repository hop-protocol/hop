type HopAddresses = {
  governance: {
    l1Hop: string
    stakingRewardsFactory: string
    stakingRewards: string
    governorAlpha: string
  }
  tokens: {
    [key: string]: {
      [key: string]: {
        [key: string]: string
      }
    }
  }
}

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '0xCc60875df511a36d9b9A4ae7f20f55d1B89EbcE2',
    stakingRewardsFactory: '0x8714CFE33dA280Ab990D1aCD33F1E7caF541dce4',
    stakingRewards: '0xdB33bf4a7b76b459407Fc5849c33AE9763D66895',
    governorAlpha: '0xadcdb487C45bCB517D3873Bb54F2e01942e4e1d5'
  },
  tokens: {
    DAI: {
      kovan: {
        l1CanonicalToken: '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9',
        l1Bridge: '0x8C295068Cd136C348F90f9f31C85A5c61Ed490Bc'
      },
      /*
      arbitrum: {
        l1CanonicalBridge: '0xE681857DEfE8b454244e701BA63EfAa078d7eA85',
        l2CanonicalBridge: '0x0000000000000000000000000000000000000064',
        l2CanonicalToken: '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9',
        l2Bridge: '0xf3af9B1Edc17c1FcA2b85dd64595F914fE2D3Dde',
        uniswapRouter: '0x2B6812d2282CF676044cBdE2D0222c08e6E1bdb2',
        uniswapFactory: '0xd28B241aB439220b85b8B90B912799DefECA8CCe',
        uniswapExchange: '0xD637bf04dF4FDFDf951C06e3c87f7801c85b161f',
        arbChain: '0x2e8aF9f74046D3E55202Fcfb893348316B142230'
      },
      */
      optimism: {
        l1CanonicalBridge: '0xC1e7Be0E1aDD345afB2485aA5E774cD79cBbbBf5',
        l2CanonicalBridge: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
        l2CanonicalToken: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
        l2Bridge: '0xd6935d3FE65f804e54a8e0d0A0F8793f0aC196Ff',
        l2HopBridgeToken: '0x761ac04A47076eadf2BfAF545e2B101C8417498e',
        uniswapWrapper: '0x6523C434ce2a4AAf168FD59a1d6074772C9a15bE',
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
        uniswapWrapper: '0x2Bc2eb99dB79DA6F2cEE57014501ea8724f841e2',
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
        l1Bridge: '0xFb157C509F27a4c474b23Ef23BDD4dE16fabF627'
      },
      arbitrum: {
        l1CanonicalBridge: '0xE681857DEfE8b454244e701BA63EfAa078d7eA85',
        l2CanonicalBridge: '0x0000000000000000000000000000000000000064',
        l2CanonicalToken: '0xE41d965f6e7541139f8D9F331176867FB6972Baf',
        l2Bridge: '0x428f09F093c836fE2b6be59d14Ed0c9DFCe4608F',
        uniswapRouter: '0x2B6812d2282CF676044cBdE2D0222c08e6E1bdb2',
        uniswapFactory: '0xd28B241aB439220b85b8B90B912799DefECA8CCe',
        uniswapExchange: '0xeA7BC91aB88759039a977AB8E774f09BF33c9A20',
        arbChain: '0x2e8aF9f74046D3E55202Fcfb893348316B142230'
      }
    }
    */
  }
}

export const blocknativeDappid = '328621b8-952f-4a86-bd39-724ba822d416'
export const infuraKey = '8e4fe7af961f48a1958584ec36742b44'
export const fortmaticApiKey = 'pk_live_AB6F615F133473CA'
export const portisDappId = 'fbde3745-1363-4ae4-a517-00d98ab2dfbc'

export const networks: any = {
  kovan: {
    networkId: '42',
    rpcUrl: 'https://kovan.rpc.hop.exchange',
    explorerUrl: 'https://kovan.etherscan.io/tx/'
  },
  /*
  arbitrum: {
    networkId: '79377087078960',
    rpcUrl: 'https://kovan3.arbitrum.io/rpc',
    explorerUrl: 'https://explorer.offchainlabs.com/#/tx/'
  },
	*/
  optimism: {
    networkId: '69',
    rpcUrl: 'https://kovan.optimism.io',
    explorerUrl: 'https://kovan-l2-explorer.surge.sh/tx/'
  },
  xdai: {
    networkId: '77',
    rpcUrl: 'https://sokol.poa.network',
    explorerUrl: 'https://blockscout.com/poa/sokol/tx/'
  }
}
