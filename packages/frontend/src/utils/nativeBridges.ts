import { EthBridger, Erc20Bridger, getL2Network } from '@arbitrum/sdk'
import { CanonicalToken, ChainId, ChainSlug } from '@hop-protocol/sdk'

export const nativeBridges = {
  USDC: {
    ethereum: {
      l1CanonicalToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      l1Bridge: '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a',
      bridgeDeployedBlockNumber: 12650032,
    },
    gnosis: {
      spender: '0x88ad09518695c6c3712AC10a214bE5109a655671', // ForeignOmnibridge
      l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671', // ForeignOmnibridge
      l2SaddleSwap: '0x5C32143C8B198F392d01f8446b754c181224ac26', // USDC + hUSDC Swap
      l2SaddleLpToken: '0x9D373d22FD091d7f9A6649EB067557cc12Fb1A0A', // USDC LP Token
    },
    polygon: {
      l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77', // PoS bridge
      l1MessengerWrapper: '0x4e9840f3C1ff368a10731D15c11516b9Fe7E1898',
      l2CanonicalBridge: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      l2CanonicalToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      l2Bridge: '0x25D8039bB044dC227f741a9e381CA4cEAE2E6aE8',
      l2HopBridgeToken: '0x9ec9551d4A1a1593b0ee8124D98590CC71b3B09D',
      l2AmmWrapper: '0x76b22b8C1079A44F1211D867D68b1eda76a635A7',
      l2SaddleSwap: '0x5C32143C8B198F392d01f8446b754c181224ac26',
      l2SaddleLpToken: '0x9D373d22FD091d7f9A6649EB067557cc12Fb1A0A', // USDC LP Token
      l1FxBaseRootTunnel: '0x4e9840f3C1ff368a10731D15c11516b9Fe7E1898',
      l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
      spender: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
      l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
      bridgeDeployedBlockNumber: 15810014,
    },
    optimism: {
      spender: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
      l1CanonicalBridge: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
      l1MessengerWrapper: '0x1ba1f1368ecEB7bFcbdE20e1F803771b7B401F7d',
      l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
      l2CanonicalToken: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      l2Bridge: '0xa81D244A1814468C734E5b4101F7b9c0c577a8fC',
      l2HopBridgeToken: '0x25D8039bB044dC227f741a9e381CA4cEAE2E6aE8',
      l2AmmWrapper: '0x2ad09850b0CA4c7c1B33f5AcD6cBAbCaB5d6e796',
      l2SaddleSwap: '0x3c0FFAca566fCcfD9Cc95139FEF6CBA143795963',
      l2SaddleLpToken: '0x2e17b8193566345a2Dd467183526dEdc42d2d5A8',
      bridgeDeployedBlockNumber: 1,
    },
    arbitrum: {
      l1CanonicalBridge: '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef', // L1GatewayRouter
      l1Gateway: '0xcEe284F754E854890e311e3280b767F80797180d', // L1CustomGateway
    },
  },
  USDT: {
    ethereum: {
      l1CanonicalToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      l1Bridge: '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6',
      bridgeDeployedBlockNumber: 12860139,
    },
    gnosis: {
      spender: '0x88ad09518695c6c3712AC10a214bE5109a655671', // ForeignOmnibridge
      l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671', // ForeignOmnibridge
    },
    polygon: {
      spender: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77', // PoS bridge
      l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77', // PoS bridge
      l1MessengerWrapper: '0x2D8b884f7aaEa1Dd13a805071530Ba9Ee9a7E035',
      l2CanonicalBridge: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      l2CanonicalToken: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      l2Bridge: '0x6c9a1ACF73bd85463A46B0AFc076FBdf602b690B',
      l2HopBridgeToken: '0x9F93ACA246F457916E49Ec923B8ed099e313f763',
      l2AmmWrapper: '0x8741Ba6225A6BF91f9D73531A98A89807857a2B3',
      l2SaddleSwap: '0xB2f7d27B21a69a033f85C42d5EB079043BAadC81',
      l2SaddleLpToken: '0x3cA3218D6c52B640B0857cc19b69Aa9427BC842C',
      l1FxBaseRootTunnel: '0x2D8b884f7aaEa1Dd13a805071530Ba9Ee9a7E035',
      l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
      spender2: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
      l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
      bridgeDeployedBlockNumber: 17058878,
    },
    optimism: {
      spender: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1', // Optimism: Gateway
      l1CanonicalBridge: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1', // Optimism: Gateway
      l1MessengerWrapper: '0xC78C53102e161094D848EE167145E5d45EAA6853',
      l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
      l2CanonicalToken: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      l2Bridge: '0x46ae9BaB8CEA96610807a275EBD36f8e916b5C61',
      l2HopBridgeToken: '0x2057C8ECB70Afd7Bee667d76B4CD373A325b1a20',
      l2AmmWrapper: '0x7D269D3E0d61A05a0bA976b7DBF8805bF844AF3F',
      l2SaddleSwap: '0xeC4B41Af04cF917b54AEb6Df58c0f8D78895b5Ef',
      l2SaddleLpToken: '0xF753A50fc755c6622BBCAa0f59F0522f264F006e',
      bridgeDeployedBlockNumber: 1,
    },
    arbitrum: {
      l1CanonicalBridge: '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef', // L1GatewayRouter
      l1MessengerWrapper: '0x70A772DDc3413e3456e5A3b2C30cB749C9577d1F',
      spender: '0xcEe284F754E854890e311e3280b767F80797180d', // L1CustomGateway
      l1Gateway: '0xcEe284F754E854890e311e3280b767F80797180d', // L1CustomGateway
      l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
      l2CanonicalToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      l2Bridge: '0x72209Fe68386b37A40d6bCA04f78356fd342491f',
      l2HopBridgeToken: '0x12e59C59D282D2C00f3166915BED6DC2F5e2B5C7',
      l2AmmWrapper: '0xCB0a4177E0A60247C0ad18Be87f8eDfF6DD30283',
      l2SaddleSwap: '0x18f7402B673Ba6Fb5EA4B95768aABb8aaD7ef18a',
      l2SaddleLpToken: '0xCe3B19D820CB8B9ae370E423B0a329c4314335fE',
      bridgeDeployedBlockNumber: 441562,
    },
  },
  MATIC: {
    ethereum: {
      l1CanonicalToken: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      l1Bridge: '0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2',
      bridgeDeployedBlockNumber: 12969385,
    },
    gnosis: {
      l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671', // ForeignOmnibridge
      l1MessengerWrapper: '0x46fc3Af3A47792cA3ED06fdF3D657145A675a8D8',
      l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
      l2CanonicalToken: '0x7122d7661c4564b7C6Cd4878B06766489a6028A2',
      l2Bridge: '0x7ac71c29fEdF94BAc5A5C9aB76E1Dd12Ea885CCC',
      l2HopBridgeToken: '0xE38faf9040c7F09958c638bBDB977083722c5156',
      l2AmmWrapper: '0x86cA30bEF97fB651b8d866D45503684b90cb3312',
      l2SaddleSwap: '0xaa30D6bba6285d0585722e2440Ff89E23EF68864',
      l2SaddleLpToken: '0x5C2048094bAaDe483D0b1DA85c3Da6200A88a849',
      l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
      l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
      bridgeDeployedBlockNumber: 17444924,
    },
    polygon: {
      l1CanonicalBridge: '0x401F6c983eA34274ec46f84D70b31C151321188b', // Plasma bridge
      l1MessengerWrapper: '0xAd33Daa2BcDf3E52D30FCca3c7066762DF657657',
      l2CanonicalBridge: '0x0000000000000000000000000000000000001010',
      l2CanonicalToken: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
      l2Bridge: '0x553bC791D746767166fA3888432038193cEED5E2',
      l2HopBridgeToken: '0x712F0cf37Bdb8299D0666727F73a5cAbA7c1c24c',
      l2AmmWrapper: '0x884d1Aa15F9957E1aEAA86a82a72e49Bc2bfCbe3',
      l2SaddleSwap: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1',
      l2SaddleLpToken: '0xbc4FB4ED825C65fF48163AF7E59d49e32edb5269',
      l1FxBaseRootTunnel: '0xAd33Daa2BcDf3E52D30FCca3c7066762DF657657',
      l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
      l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
      bridgeDeployedBlockNumber: 17669097,
    },
  },
  DAI: {
    ethereum: {
      l1CanonicalToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      l1Bridge: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1',
      bridgeDeployedBlockNumber: 13226217,
    },
    gnosis: {
      spender: '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016', // POA xDAI bridge
      l1CanonicalBridge: '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016', // POA xDAI bridge
      l1MessengerWrapper: '0x723194C6Cfed24883b598931Ee802ab80952C001',
      l2CanonicalBridge: '0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6', // HomeBridgeErcToNative
      l2CanonicalToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // WXDAI
      l2Bridge: '0x0460352b91D7CF42B0E1C1c30f06B602D9ef2238',
      l2HopBridgeToken: '0xB1ea9FeD58a317F81eEEFC18715Dd323FDEf45c4',
      l2AmmWrapper: '0x6C928f435d1F3329bABb42d69CCF043e3900EcF1',
      l2SaddleSwap: '0x24afDcA4653042C6D08fb1A754b2535dAcF6Eb24', // WXDAI + hDAI Swap
      l2SaddleLpToken: '0x5300648b1cFaa951bbC1d56a4457083D92CFa33F', // Hop DAI LP Token
      l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
      l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
      bridgeDeployedBlockNumber: 18093617,
    },
    polygon: {
      l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77', // PoS Bridge
      l1MessengerWrapper: '0xB8a49c3137f27b04ee9E68727147b3131764B8A0',
      l2CanonicalBridge: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      l2CanonicalToken: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      l2Bridge: '0xEcf268Be00308980B5b3fcd0975D47C4C8e1382a',
      l2HopBridgeToken: '0xb8901acB165ed027E32754E0FFe830802919727f',
      l2AmmWrapper: '0x28529fec439cfF6d7D1D5917e956dEE62Cd3BE5c',
      l2SaddleSwap: '0x25FB92E505F752F730cAD0Bd4fa17ecE4A384266',
      l2SaddleLpToken: '0x8b7aA8f5cc9996216A88D900df8B8a0a3905939A',
      l1FxBaseRootTunnel: '0xB8a49c3137f27b04ee9E68727147b3131764B8A0',
      l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
      l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
      bridgeDeployedBlockNumber: 19112518,
    },
    optimism: {
      l1CanonicalBridge: '0x10E6593CDda8c58a1d0f14C5164B376352a55f2F',
      l1MessengerWrapper: '0x4285CaAB762f2e405CD256069D0D47D13bf05B00',
      l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
      l2CanonicalToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      l2Bridge: '0x7191061D5d4C60f598214cC6913502184BAddf18',
      l2HopBridgeToken: '0x56900d66D74Cb14E3c86895789901C9135c95b16',
      l2AmmWrapper: '0xb3C68a491608952Cb1257FC9909a537a0173b63B',
      l2SaddleSwap: '0xF181eD90D6CfaC84B8073FdEA6D34Aa744B41810',
      l2SaddleLpToken: '0x22D63A26c730d49e5Eab461E4f5De1D8BdF89C92',
      bridgeDeployedBlockNumber: 1,
    },
    arbitrum: {
      l1CanonicalBridge: '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef', // L1GatewayRouter
      l1MessengerWrapper: '0x25a5A48C35e75BD2EFf53D94f0BB60d5A00E36ea',
      l1Gateway: '0xD3B5b60020504bc3489D6949d545893982BA3011', // L1DaiGateway
      l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
      l2CanonicalToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      l2Bridge: '0x7aC115536FE3A185100B2c4DE4cb328bf3A58Ba6',
      l2HopBridgeToken: '0x46ae9BaB8CEA96610807a275EBD36f8e916b5C61',
      l2AmmWrapper: '0xe7F40BF16AB09f4a6906Ac2CAA4094aD2dA48Cc2',
      l2SaddleSwap: '0xa5A33aB9063395A90CCbEa2D86a62EcCf27B5742',
      l2SaddleLpToken: '0x68f5d998F00bB2460511021741D098c05721d8fF',
      bridgeDeployedBlockNumber: 945326,
    },
  },
  ETH: {
    ethereum: {
      l1CanonicalToken: '0x0000000000000000000000000000000000000000',
      l1Bridge: '0xb8901acB165ed027E32754E0FFe830802919727f',
      bridgeDeployedBlockNumber: 13331564,
    },
    gnosis: {
      l1CanonicalBridge: '0xa6439Ca0FCbA1d0F80df0bE6A17220feD9c9038a', // WETHOmnibridgeRouter
      l1MessengerWrapper: '0x25FB92E505F752F730cAD0Bd4fa17ecE4A384266',
      l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
      l2CanonicalToken: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1', // WETH
      l2Bridge: '0xD8926c12C0B2E5Cd40cFdA49eCaFf40252Af491B',
      l2HopBridgeToken: '0xc46F2004006d4C770346f60a7BaA3f1Cc67dFD1c',
      l2AmmWrapper: '0x03D7f750777eC48d39D080b020D83Eb2CB4e3547',
      l2SaddleSwap: '0x4014DC015641c08788F15bD6eB20dA4c47D936d8', // WETH + hETH Swap
      l2SaddleLpToken: '0xb9cca4Ed3f082a459c0851058D9FBA0B78dD6C7d', // ETH LP Token
      l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
      l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
      bridgeDeployedBlockNumber: 18359713,
    },
    polygon: {
      l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77', // PoS Bridge
      l1MessengerWrapper: '0x69d10828233D7a656104455445d289bBFD50eF6d',
      l2CanonicalBridge: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      l2CanonicalToken: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      l2Bridge: '0xb98454270065A31D71Bf635F6F7Ee6A518dFb849',
      l2HopBridgeToken: '0x1fDeAF938267ca43388eD1FdB879eaF91e920c7A',
      l2AmmWrapper: '0xc315239cFb05F1E130E7E28E603CEa4C014c57f0',
      l2SaddleSwap: '0x266e2dc3C4c59E42AA07afeE5B09E964cFFe6778',
      l2SaddleLpToken: '0x971039bF0A49c8d8A675f839739eE7a42511eC91',
      l1FxBaseRootTunnel: '0x69d10828233D7a656104455445d289bBFD50eF6d',
      l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
      l1PosPredicate: '0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30',
      bridgeDeployedBlockNumber: 19706859,
    },
    optimism: {
      l1CanonicalBridge: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
      l1MessengerWrapper: '0x64e5A143a3775a500BF19E609E1a74A5Cbc3bb2A',
      l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
      l2CanonicalToken: '0x4200000000000000000000000000000000000006',
      l2Bridge: '0x83f6244Bd87662118d96D9a6D44f09dffF14b30E',
      l2HopBridgeToken: '0xE38faf9040c7F09958c638bBDB977083722c5156',
      l2AmmWrapper: '0x86cA30bEF97fB651b8d866D45503684b90cb3312',
      l2SaddleSwap: '0xaa30D6bba6285d0585722e2440Ff89E23EF68864',
      l2SaddleLpToken: '0x5C2048094bAaDe483D0b1DA85c3Da6200A88a849',
      bridgeDeployedBlockNumber: 1,
    },
    arbitrum: {
      l1CanonicalBridge: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f', // ArbitrumIndex
      l1MessengerWrapper: '0xEcf268Be00308980B5b3fcd0975D47C4C8e1382a',
      l1Gateway: '0x0000000000000000000000000000000000000000',
      l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
      l2CanonicalToken: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      l2Bridge: '0x3749C4f034022c39ecafFaBA182555d4508caCCC',
      l2HopBridgeToken: '0xDa7c0de432a9346bB6e96aC74e3B61A36d8a77eB',
      l2AmmWrapper: '0x33ceb27b39d2Bb7D2e61F7564d3Df29344020417',
      l2SaddleSwap: '0x652d27c0F72771Ce5C76fd400edD61B406Ac6D97',
      l2SaddleLpToken: '0x59745774Ed5EfF903e615F5A2282Cae03484985a',
      bridgeDeployedBlockNumber: 2135598,
    },
  },
  WBTC: {
    ethereum: {
      l1CanonicalToken: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      l1Bridge: '0xb98454270065A31D71Bf635F6F7Ee6A518dFb849',
      bridgeDeployedBlockNumber: 13476113,
    },
    gnosis: {
      l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671', // ForeignOmnibridge
      l1MessengerWrapper: '0xc315239cFb05F1E130E7E28E603CEa4C014c57f0',
      l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
      l2CanonicalToken: '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252',
      l2Bridge: '0x07C592684Ee9f71D58853F9387579332d471b6Ca',
      l2HopBridgeToken: '0x16284c7323c35F4960540583998C98B1CfC581a7',
      l2AmmWrapper: '0x70aF36240eC5040f6f9501E8E2D9db8703ec3d45',
      l2SaddleSwap: '0xb07c6505e1E41112494123e40330c5Ac09817CFB',
      l2SaddleLpToken: '0x300aa02c86BDceFb9B7AF85b736823C56a302512',
      l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
      l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
      bridgeDeployedBlockNumber: 18723032,
    },
    polygon: {
      l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77', // PoS bridge
      l1MessengerWrapper: '0x1dDEc1131eCf33cb59c5611Db607B8c3aC285513',
      l2CanonicalBridge: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
      l2CanonicalToken: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
      l2Bridge: '0x91Bd9Ccec64fC22475323a0E55d58F7786587905',
      l2HopBridgeToken: '0xB8a49c3137f27b04ee9E68727147b3131764B8A0',
      l2AmmWrapper: '0xCd1d7AEfA8055e020db0d0e98bbF3FeD1A16aad6',
      l2SaddleSwap: '0x4e9840f3C1ff368a10731D15c11516b9Fe7E1898',
      l2SaddleLpToken: '0xd72c6F464F28F9A89B5206D5e73C491092d34042',
      l1FxBaseRootTunnel: '0x1dDEc1131eCf33cb59c5611Db607B8c3aC285513',
      l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
      l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
      bridgeDeployedBlockNumber: 20536705,
    },
    optimism: {
      l1CanonicalBridge: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
      l1MessengerWrapper: '0x08706c95f86305FE76E9eA1be7A2474eb5cEfB3B',
      l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
      l2CanonicalToken: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
      l2Bridge: '0xB1ea9FeD58a317F81eEEFC18715Dd323FDEf45c4',
      l2HopBridgeToken: '0xa492d3596e8391E376D4f5a5cBA5C077B890b094',
      l2AmmWrapper: '0x2A11a98e2fCF4674F30934B5166645fE6CA35F56',
      l2SaddleSwap: '0x46fc3Af3A47792cA3ED06fdF3D657145A675a8D8',
      l2SaddleLpToken: '0x07CE97eb3f375901D26Ec1e32144292318839802',
      bridgeDeployedBlockNumber: 1,
    },
    arbitrum: {
      l1CanonicalBridge: '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef', // L1GatewayRouter
      l1MessengerWrapper: '0x117f2f67cD7570E0E8Fd30264f96Ca39eEbc1A5E',
      l1Gateway: '0xcEe284F754E854890e311e3280b767F80797180d', // L1CustomGateway
      l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
      l2CanonicalToken: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      l2Bridge: '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6',
      l2HopBridgeToken: '0xA49600627D913B61714fF2a205Fb1096f1bceAb2',
      l2AmmWrapper: '0xC08055b634D43F2176d721E26A3428D3b7E7DdB5',
      l2SaddleSwap: '0x7191061D5d4C60f598214cC6913502184BAddf18',
      l2SaddleLpToken: '0xa16768F69667e2ec8ebacdD4c9A9092ae2fFe2ca',
      bridgeDeployedBlockNumber: 2481596,
    },
  },
}

export async function initNativeBridge(l2Chain: ChainSlug, token: CanonicalToken) {
  if (l2Chain === ChainSlug.Arbitrum) {
    const l2Network = await getL2Network(ChainId.Arbitrum)
    let bridge: EthBridger | Erc20Bridger
    if (token === CanonicalToken.ETH) {
      bridge = new EthBridger(l2Network)
    } else {
      bridge = new Erc20Bridger(l2Network)
    }
    console.log(`arb bridge:`, bridge)

    return bridge
  }
}
