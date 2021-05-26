import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: ['0x81682250D4566B2986A2B33e23e7c52D401B7aB7'],
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0xA46d09fd4B7961aE16D33122660f43726cB1Ff36',
        l1Bridge: '0x7b067CE7D77a0468159D5C73A3109eE8fEFcBE6d'
      },
      xdai: {
        l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
        l1MessengerWrapper: '0xA41933De69EFF73D0A92E8179D7D520f2016C8F8',
        l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
        l2CanonicalToken: '0x3b0977b9e563F63F219019616BBD12cB1cdFF527',
        l2Bridge: '0x95ee0aE78FceF0b20d07718281A93876353E1C77',
        l2HopBridgeToken: '0x2441244C710c9482099ddfd779D9b2725D5a4D1d',
        l2AmmWrapper: '0xCbB818feAE344d5B82beD516b68B00A06208BD0A',
        l2SaddleSwap: '0x7C82b921EF93C1A9aa186B31E2c5f7A57c1BFBf5',
        l2SaddleLpToken: '0xd6fa75f9639F8f85867345319C34Cf5a8dd79A66',
        l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        canonicalBridgeMaxPerTx: '10000'
      },
      optimism: {
        l1CanonicalBridge: '0xC48528a44f2D961D179D69434645E54ac85732a1',
        l1MessengerWrapper: '0x959c21F8490092EbD32E52713C10f8cAfcf17477',
        l2CanonicalBridge: '0x7B2ab06D22Cd230102215532928f60770376a2B3',
        l2CanonicalToken: '0x3b8e53B3aB8E01Fb57D0c9E893bC4d655AA67d84',
        l2Bridge: '0x0E72827bE46c9F2eA3ce5Dc8c667E9790a2C20cA',
        l2HopBridgeToken: '0xa36E84bC6d3fc021b5AFD9cc5d22315a31fD8c4A',
        l2AmmWrapper: '0xb3395d2311c875ce2ec8a4d34c8D5C15012748cB',
        l2SaddleSwap: '0xeED1e285306EEF0D8BAd52c160C6A042420b2045',
        l2SaddleLpToken: '0xE41C81F02840704234e0266B42A0F786Ad8474e9'
      }
    },
    DAI: {
      ethereum: {
        l1CanonicalToken: '0x436e3FfB93A4763575E5C0F6b3c97D5489E050da',
        l1Bridge: '0x2bd2fD36565f606F137a26522D62A24e3eB1a3fC'
      },
      xdai: {
        l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
        l1MessengerWrapper: '0xCEC73Cc094E2b6AE8f7275e1e4F6A383BDa28b24',
        l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
        l2CanonicalToken: '0x6D2d8B29d92cab87a273e872FcC4650A64116283',
        l2Bridge: '0x2289f8dBb6B87854C24b6f2CdB38274db3067DB6',
        l2HopBridgeToken: '0x36378Bd11C261708A12453271582A719152566e3',
        l2AmmWrapper: '0x510a2e11a7c025f3323B08a9056198c19Eb52F68',
        l2SaddleSwap: '0x4816544201cFBcc44877eF4b3A32532d8f2083cB',
        l2SaddleLpToken: '0xaD347F3CCbe870cE5502E03dbc24169F9E557524',
        l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        canonicalBridgeMaxPerTx: '10000'
      },
      optimism: {
        l1CanonicalBridge: '0xC48528a44f2D961D179D69434645E54ac85732a1',
        l1MessengerWrapper: '0x2cb57494fB3890C754CED2296071F228CAEee35d',
        l2CanonicalBridge: '0x7B2ab06D22Cd230102215532928f60770376a2B3',
        l2CanonicalToken: '0xFB6528eFbEe8B900CeBf2c4Cf709b1EF36D46A60',
        l2Bridge: '0xdb7C63d1Cb01877A91e915056FfC07Ff5a38b202',
        l2HopBridgeToken: '0x98C4d14e3D43E114fE40B6c13B199AA8F702bC90',
        l2AmmWrapper: '0x34A5BE7add88633D56b4F002C6f9D8abD1703654',
        l2SaddleSwap: '0x742DDbF5f4C9F70bDB85d980282cfDF09387697B',
        l2SaddleLpToken: '0x7076AC95eBb2514A2b17aC761BF7bcB404B23829'
      }
    }
  }
}
