import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
    USDC: ['0xa6a688F107851131F0E1dce493EbBebFAf99203e'],
    USDT: ['0xa6a688F107851131F0E1dce493EbBebFAf99203e'],
    MATIC: ['0xd8781ca9163e9f132a4d8392332e64115688013a'],
    DAI: ['0xa6a688F107851131F0E1dce493EbBebFAf99203e']
  },
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        l1Bridge: '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a',
        bridgeDeployedBlockNumber: 12650032
      },
      xdai: {
        l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        l1MessengerWrapper: '0x12e59C59D282D2C00f3166915BED6DC2F5e2B5C7',
        l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
        l2CanonicalToken: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
        l2Bridge: '0x25D8039bB044dC227f741a9e381CA4cEAE2E6aE8',
        l2HopBridgeToken: '0x9ec9551d4A1a1593b0ee8124D98590CC71b3B09D',
        l2AmmWrapper: '0x76b22b8C1079A44F1211D867D68b1eda76a635A7',
        l2SaddleSwap: '0x5C32143C8B198F392d01f8446b754c181224ac26',
        l2SaddleLpToken: '0x9D373d22FD091d7f9A6649EB067557cc12Fb1A0A',
        l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
        canonicalBridgeMaxPerTx: 1000000000,
        bridgeDeployedBlockNumber: 16617211
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0x10541b07d8Ad2647Dc6cD67abd4c03575dade261',
        l2CanonicalBridge: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2CanonicalToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2Bridge: '0x25D8039bB044dC227f741a9e381CA4cEAE2E6aE8',
        l2HopBridgeToken: '0x9ec9551d4A1a1593b0ee8124D98590CC71b3B09D',
        l2AmmWrapper: '0x76b22b8C1079A44F1211D867D68b1eda76a635A7',
        l2SaddleSwap: '0x5C32143C8B198F392d01f8446b754c181224ac26',
        l2SaddleLpToken: '0x9D373d22FD091d7f9A6649EB067557cc12Fb1A0A',
        l1FxBaseRootTunnel: '0x10541b07d8Ad2647Dc6cD67abd4c03575dade261',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        bridgeDeployedBlockNumber: 15810014
      },
      optimism: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0x1ba1f1368ecEB7bFcbdE20e1F803771b7B401F7d',
        l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
        l2CanonicalToken: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        l2Bridge: '0xa81D244A1814468C734E5b4101F7b9c0c577a8fC',
        l2HopBridgeToken: '0x25D8039bB044dC227f741a9e381CA4cEAE2E6aE8',
        l2AmmWrapper: '0x2ad09850b0CA4c7c1B33f5AcD6cBAbCaB5d6e796',
        l2SaddleSwap: '0x3c0FFAca566fCcfD9Cc95139FEF6CBA143795963',
        l2SaddleLpToken: '0x2e17b8193566345a2Dd467183526dEdc42d2d5A8',
        bridgeDeployedBlockNumber: 856160
      },
      arbitrum: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0xaC9BABf20eF2338D7F4a152Af43bedDC80C6ae2a',
        l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l2CanonicalToken: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        l2Bridge: '0x0e0E3d2C5c292161999474247956EF542caBF8dd',
        l2HopBridgeToken: '0x0ce6c85cF43553DE10FC56cecA0aef6Ff0DD444d',
        l2AmmWrapper: '0xe22D2beDb3Eca35E6397e0C6D62857094aA26F52',
        l2SaddleSwap: '0x10541b07d8Ad2647Dc6cD67abd4c03575dade261',
        l2SaddleLpToken: '0xB67c014FA700E69681a673876eb8BAFAA36BFf71',
        bridgeDeployedBlockNumber: 440027
      }
    },
    USDT: {
      ethereum: {
        l1CanonicalToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        l1Bridge: '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6',
        bridgeDeployedBlockNumber: 12860139
      },
      xdai: {
        l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        l1MessengerWrapper: '0xC08055b634D43F2176d721E26A3428D3b7E7DdB5',
        l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
        l2CanonicalToken: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
        l2Bridge: '0xFD5a186A7e8453Eb867A360526c5d987A00ACaC2',
        l2HopBridgeToken: '0x91f8490eC27cbB1b2FaEdd29c2eC23011d7355FB',
        l2AmmWrapper: '0x49094a1B3463c4e2E82ca41b8e6A023bdd6E222f',
        l2SaddleSwap: '0x3Aa637D6853f1d9A9354FE4301Ab852A88b237e7',
        l2SaddleLpToken: '0x5b10222f2Ada260AAf6C6fC274bd5810AF9d33c0',
        l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
        canonicalBridgeMaxPerTx: 1000000000,
        bridgeDeployedBlockNumber: 17155195
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0xe7C1D08aC706444F356af2D37541d8d57e8C57B6',
        l2CanonicalBridge: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        l2CanonicalToken: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        l2Bridge: '0x6c9a1ACF73bd85463A46B0AFc076FBdf602b690B',
        l2HopBridgeToken: '0x9F93ACA246F457916E49Ec923B8ed099e313f763',
        l2AmmWrapper: '0x8741Ba6225A6BF91f9D73531A98A89807857a2B3',
        l2SaddleSwap: '0xB2f7d27B21a69a033f85C42d5EB079043BAadC81',
        l2SaddleLpToken: '0x3cA3218D6c52B640B0857cc19b69Aa9427BC842C',
        l1FxBaseRootTunnel: '0xe7C1D08aC706444F356af2D37541d8d57e8C57B6',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        bridgeDeployedBlockNumber: 17058878
      },
      optimism: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0xC78C53102e161094D848EE167145E5d45EAA6853',
        l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
        l2CanonicalToken: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        l2Bridge: '0x46ae9BaB8CEA96610807a275EBD36f8e916b5C61',
        l2HopBridgeToken: '0x2057C8ECB70Afd7Bee667d76B4CD373A325b1a20',
        l2AmmWrapper: '0x7D269D3E0d61A05a0bA976b7DBF8805bF844AF3F',
        l2SaddleSwap: '0xeC4B41Af04cF917b54AEb6Df58c0f8D78895b5Ef',
        l2SaddleLpToken: '0xF753A50fc755c6622BBCAa0f59F0522f264F006e',
        bridgeDeployedBlockNumber: 856444
      },
      arbitrum: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0x70A772DDc3413e3456e5A3b2C30cB749C9577d1F',
        l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l2CanonicalToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        l2Bridge: '0x72209Fe68386b37A40d6bCA04f78356fd342491f',
        l2HopBridgeToken: '0x12e59C59D282D2C00f3166915BED6DC2F5e2B5C7',
        l2AmmWrapper: '0xCB0a4177E0A60247C0ad18Be87f8eDfF6DD30283',
        l2SaddleSwap: '0x18f7402B673Ba6Fb5EA4B95768aABb8aaD7ef18a',
        l2SaddleLpToken: '0xCe3B19D820CB8B9ae370E423B0a329c4314335fE',
        bridgeDeployedBlockNumber: 441562
      }
    },
    MATIC: {
      ethereum: {
        l1CanonicalToken: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        l1Bridge: '0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2',
        bridgeDeployedBlockNumber: 12969385
      },
      xdai: {
        l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671',
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
        canonicalBridgeMaxPerTx: 1000000000,
        bridgeDeployedBlockNumber: 17444924
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0xa492d3596e8391E376D4f5a5cBA5C077B890b094',
        l2CanonicalBridge: '0x0000000000000000000000000000000000001010',
        l2CanonicalToken: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        l2Bridge: '0x553bC791D746767166fA3888432038193cEED5E2',
        l2HopBridgeToken: '0x712F0cf37Bdb8299D0666727F73a5cAbA7c1c24c',
        l2AmmWrapper: '0x884d1Aa15F9957E1aEAA86a82a72e49Bc2bfCbe3',
        l2SaddleSwap: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1',
        l2SaddleLpToken: '0xbc4FB4ED825C65fF48163AF7E59d49e32edb5269',
        l1FxBaseRootTunnel: '0xa492d3596e8391E376D4f5a5cBA5C077B890b094',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        bridgeDeployedBlockNumber: 17669097
      }
    },
    DAI: {
      ethereum: {
        l1CanonicalToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        l1Bridge: '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1',
        bridgeDeployedBlockNumber: 13226217
      },
      xdai: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0x723194C6Cfed24883b598931Ee802ab80952C001',
        l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
        l2CanonicalToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
        l2Bridge: '0x0460352b91D7CF42B0E1C1c30f06B602D9ef2238',
        l2HopBridgeToken: '0xB1ea9FeD58a317F81eEEFC18715Dd323FDEf45c4',
        l2AmmWrapper: '0x6C928f435d1F3329bABb42d69CCF043e3900EcF1',
        l2SaddleSwap: '0x24afDcA4653042C6D08fb1A754b2535dAcF6Eb24',
        l2SaddleLpToken: '0x5300648b1cFaa951bbC1d56a4457083D92CFa33F',
        l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
        canonicalBridgeMaxPerTx: 1000000000,
        bridgeDeployedBlockNumber: 18093617
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0x50d7d8B850e0e880295800790551928F4546BfE2',
        l2CanonicalBridge: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        l2CanonicalToken: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        l2Bridge: '0xEcf268Be00308980B5b3fcd0975D47C4C8e1382a',
        l2HopBridgeToken: '0xb8901acB165ed027E32754E0FFe830802919727f',
        l2AmmWrapper: '0x28529fec439cfF6d7D1D5917e956dEE62Cd3BE5c',
        l2SaddleSwap: '0x25FB92E505F752F730cAD0Bd4fa17ecE4A384266',
        l2SaddleLpToken: '0x8b7aA8f5cc9996216A88D900df8B8a0a3905939A',
        l1FxBaseRootTunnel: '0x50d7d8B850e0e880295800790551928F4546BfE2',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        bridgeDeployedBlockNumber: 19112518
      },
      optimism: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0x4285CaAB762f2e405CD256069D0D47D13bf05B00',
        l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
        l2CanonicalToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        l2Bridge: '0x7191061D5d4C60f598214cC6913502184BAddf18',
        l2HopBridgeToken: '0x56900d66D74Cb14E3c86895789901C9135c95b16',
        l2AmmWrapper: '0xb3C68a491608952Cb1257FC9909a537a0173b63B',
        l2SaddleSwap: '0xF181eD90D6CfaC84B8073FdEA6D34Aa744B41810',
        l2SaddleLpToken: '0x22D63A26c730d49e5Eab461E4f5De1D8BdF89C92',
        bridgeDeployedBlockNumber: 1746403
      }
    },
  }
}
