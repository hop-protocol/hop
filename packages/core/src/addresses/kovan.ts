import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
    USDC: ['0x81682250D4566B2986A2B33e23e7c52D401B7aB7']
    // DAI: ['0x81682250D4566B2986A2B33e23e7c52D401B7aB7']
  },
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0xA46d09fd4B7961aE16D33122660f43726cB1Ff36',
        l1Bridge: '0xf89E134Ce2e83B535D3Cfa63a902375f993Fc0D2',
        bridgeDeployedBlockNumber: 25529054
      },
      xdai: {
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
        canonicalBridgeMaxPerTx: 10000,
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
    }
    // DAI: {
    //   ethereum: {
    //     l1CanonicalToken: '0x436e3FfB93A4763575E5C0F6b3c97D5489E050da',
    //     l1Bridge: '0x99468fB816C81632614eb6edD3a445963dfDF7c9',
    //     bridgeDeployedBlockNumber: 26152536
    //   },
    //   xdai: {
    //     l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
    //     l1MessengerWrapper: '0xA15E4980998dd62501AF3Fe3Dc9F494c13E7d32d',
    //     l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
    //     l2CanonicalToken: '0x1085e25E7085a8c96aa61DFf368A0e363E7432E6',
    //     l2Bridge: '0xFB6528eFbEe8B900CeBf2c4Cf709b1EF36D46A60',
    //     l2HopBridgeToken: '0x3376b7cB556595b7B32c9b9be6103386E2BC8479',
    //     l2AmmWrapper: '0x98C4d14e3D43E114fE40B6c13B199AA8F702bC90',
    //     l2SaddleSwap: '0x27eEf69aD0c45E33218ea7928519aa6b771397CF',
    //     l2SaddleLpToken: '0x093025677156bE80c7aFd6542107bFc7edF4b809',
    //     l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
    //     l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
    //     canonicalBridgeMaxPerTx: 10000,
    //     bridgeDeployedBlockNumber: 21799634
    //   }
    //   // optimism: {
    //   // l1CanonicalBridge: '0xC48528a44f2D961D179D69434645E54ac85732a1',
    //   // l1MessengerWrapper: '0x2cb57494fB3890C754CED2296071F228CAEee35d',
    //   // l2CanonicalBridge: '0x7B2ab06D22Cd230102215532928f60770376a2B3',
    //   // l2CanonicalToken: '0xFB6528eFbEe8B900CeBf2c4Cf709b1EF36D46A60',
    //   // l2Bridge: '0xdb7C63d1Cb01877A91e915056FfC07Ff5a38b202',
    //   // l2HopBridgeToken: '0x98C4d14e3D43E114fE40B6c13B199AA8F702bC90',
    //   // l2AmmWrapper: '0x34A5BE7add88633D56b4F002C6f9D8abD1703654',
    //   // l2SaddleSwap: '0x742DDbF5f4C9F70bDB85d980282cfDF09387697B',
    //   // l2SaddleLpToken: '0x7076AC95eBb2514A2b17aC761BF7bcB404B23829'
    //   // }
    // }
  }
}
