type HopAddresses = {
  l1Token: string
  l1Bridge: string
  governance: {
    l1Hop: string
    stakingRewardsFactory: string
    stakingRewards: string
    governorAlpha: string
  }
  networks: {
    [key: string]: {
      [key: string]: string
    }
  }
}

export const addresses: HopAddresses = {
  l1Token: '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9',
  l1Bridge: '0xe74EFb19BBC46DbE28b7BaB1F14af6eB7158B4BE',
  governance: {
    l1Hop: '0xCc60875df511a36d9b9A4ae7f20f55d1B89EbcE2',
    stakingRewardsFactory: '0x8714CFE33dA280Ab990D1aCD33F1E7caF541dce4',
    stakingRewards: '0xdB33bf4a7b76b459407Fc5849c33AE9763D66895',
    governorAlpha: '0xadcdb487C45bCB517D3873Bb54F2e01942e4e1d5'
  },
  networks: {
    arbitrum: {
      l1CanonicalBridge: '0xE681857DEfE8b454244e701BA63EfAa078d7eA85',
      l2CanonicalBridge: '0x0000000000000000000000000000000000000064',
      l2CanonicalToken: '0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9',
      l2Bridge: '0xf3af9B1Edc17c1FcA2b85dd64595F914fE2D3Dde',
      uniswapRouter: '0x2B6812d2282CF676044cBdE2D0222c08e6E1bdb2',
      uniswapFactory: '0xd28B241aB439220b85b8B90B912799DefECA8CCe',
      arbChain: '0x2e8aF9f74046D3E55202Fcfb893348316B142230'
    },
    optimism: {
      l1CanonicalBridge: '0xA6e9F1409fe85c84CEACD5936800A12d721009cE',
      l2CanonicalBridge: '0x61cBe9766fe7392A4DE03A54b2069c103AE674eb',
      l2CanonicalToken: '0x57eaeE3D9C99b93D8FD1b50EF274579bFEC8e14B', // Temp
      l2Bridge: '0x6d2f304CFF4e0B67dA4ab38C6A5C8184a2424D05',
      uniswapRouter: '0x3C67B82D67B4f31A54C0A516dE8d3e93D010EDb3',
      uniswapFactory: '0x3e4CFaa8730092552d9425575E49bB542e329981'
    }
  }
}
