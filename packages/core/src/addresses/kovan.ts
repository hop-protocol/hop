import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
    USDC: {
      ethereum: {
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        gnosis: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      optimism: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        gnosis: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      gnosis: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      }
    },
    ETH: {
      ethereum: {
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        gnosis: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      optimism: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        gnosis: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      gnosis: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      }
    }
  },
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0xA46d09fd4B7961aE16D33122660f43726cB1Ff36',
        l1Bridge: '0xf89E134Ce2e83B535D3Cfa63a902375f993Fc0D2',
        bridgeDeployedBlockNumber: 25529054
      },
      gnosis: {
        l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
        l1MessengerWrapper: '0x03a7fa6c6603A7079c269dAFe601C1106fD328A8',
        l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
        l2CanonicalToken: '0x3b0977b9e563F63F219019616BBD12cB1cdFF527',
        l2Bridge: '0xbe5DC176D31f0838Fe4A2f81f0DDb7ce22A8DdAb',
        l2HopBridgeToken: '0x5420cbF7B2Ca1CDC23C25459AD5A1e54dDe7d776',
        l2AmmWrapper: '0xEe028139BD4C11C1FDdAfB69D24114624E0aAdab',
        l2SaddleSwap: '0x6fEd6dF9707d16d1186e333dDed95ee5DaCa6E1E',
        l2SaddleLpToken: '0xC888C7071F8B9d2c3b8034F1Da7cBd35595191BD',
        l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        bridgeDeployedBlockNumber: 21377885
      },
      optimism: {
        l1CanonicalBridge: '0x531984eEccac4c5e6ABb5439c02d5861110bdA43',
        l1MessengerWrapper: '0x21BB6b9B1e96441f166bfA03EB288F25A47CCc39',
        l2CanonicalBridge: '0x3B88CAb5A989C8AF0931ed171dbF7427BEb2df9A',
        l2CanonicalToken: '0x3b8e53B3aB8E01Fb57D0c9E893bC4d655AA67d84',
        l2Bridge: '0x3444A15413923b6DB5Fd5AcCBa5731e21aeCAf10',
        l2HopBridgeToken: '0x0CB64eA2890bcC00F4619C0E6C8823b09240369C',
        l2AmmWrapper: '0x6ad8573880560CF3E88B9d943927136F376559af',
        l2SaddleSwap: '0xd75005fBB30973c302Ef68C0c90F732713420EA0',
        l2SaddleLpToken: '0xcBB29B17F7e2321aBB0926fF2887D6E2d8CBBa42',
        bridgeDeployedBlockNumber: 888437
      }
    },
    ETH: {
      ethereum: {
        l1CanonicalToken: '0x0000000000000000000000000000000000000000',
        l1Bridge: '0x016214b4E61B67C774AFF9700359Fe5667A3EE49',
        bridgeDeployedBlockNumber: 27669189
      },
      optimism: {
        l1CanonicalBridge: '0x531984eEccac4c5e6ABb5439c02d5861110bdA43',
        l1MessengerWrapper: '0x35c6D10effcEC6CC2FfB2F0D4908aCF092a2A036',
        l2CanonicalBridge: '0x3B88CAb5A989C8AF0931ed171dbF7427BEb2df9A',
        l2CanonicalToken: '0x4200000000000000000000000000000000000006',
        l2Bridge: '0x1261CaA21f059d8D386D76e0C1349d4E1B541C5A',
        l2HopBridgeToken: '0x45f6370A540d3148Dc6c20142d16E0290671276A',
        l2AmmWrapper: '0xc9E6628791cdD4ad568550fcc6f378cEF27e98fd',
        l2SaddleSwap: '0xD6E31cE884DFf44c4600fD9D36BcC9af447C28d5',
        l2SaddleLpToken: '0x93168D7e16e49E28dE5B05bb7aD015ae77082812',
        bridgeDeployedBlockNumber: 1661404
      }
    }
  }
}
