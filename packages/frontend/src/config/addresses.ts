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
        l1Bridge: '0xe74EFb19BBC46DbE28b7BaB1F14af6eB7158B4BE'
      },
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
      optimism: {
        l1CanonicalBridge: '0xA6e9F1409fe85c84CEACD5936800A12d721009cE',
        l2CanonicalBridge: '0x61cBe9766fe7392A4DE03A54b2069c103AE674eb',
        l2CanonicalToken: '0x57eaeE3D9C99b93D8FD1b50EF274579bFEC8e14B',
        l2Bridge: '0x6d2f304CFF4e0B67dA4ab38C6A5C8184a2424D05',
        uniswapRouter: '0x3C67B82D67B4f31A54C0A516dE8d3e93D010EDb3',
        uniswapFactory: '0x3e4CFaa8730092552d9425575E49bB542e329981',
        uniswapExchange: '0x65F72DF8a668BC6272B059BB7F53ADc91066540C'
      },
      xdai: {
        l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
        l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
        l2CanonicalToken: '0x714983a8Dc3329bf3BeB8F36b49878CF944E5A3B',
        l2Bridge: '0x2d8948542E732c1fDaDdC36164219D7B4d178965',
        uniswapRouter: '0x47a83B71AB3F8086c31Bfe518D64262Baf86145e',
        uniswapFactory: '0x2C4c5e8F1057Ca7B0cB91b7e3B51f4B2E773B5eB',
        uniswapExchange: '0x7D2E076711D5c7a26564CCc0c64663003A8c038E'
      }
    },
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
  }
}
