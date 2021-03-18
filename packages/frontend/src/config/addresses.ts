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
        l1Bridge: '0xbFE287FD6d9a856b10281083c0B03160998F51d9'
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
        l1CanonicalBridge: '0xC76F55Dd0aeF08e46a454DCbb4fAA940d4450C72',
        l2CanonicalBridge: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
        l2CanonicalToken: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
        l2Bridge: '0xcdEFB10800763eeC078e829aa8cC15C97E784bCD',
        l2HopBridgeToken: '0xe0a010115Cad71C25217cDaa525ed6F7637D5c6F',
        uniswapWrapper: '0x8889DBf65B2a195Ad2325403363b6028EFa2Bd65',
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
        uniswapWrapper: '0x0d253e4E94055D63B32A845b5CFBEEB65420bAD2',
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
    //rpcUrl: 'https://kovan.rpc.hop.exchange',
    rpcUrl: 'https://kovan.infura.io/v3/7cae17e7d92c45ef8b90dda61a056c78',
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
