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
        l1MessengerWrapper: '0x188719A2c072eeE833d49988Ec89bb31D07167E5',
        l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
        l2CanonicalToken: '0x3b0977b9e563F63F219019616BBD12cB1cdFF527',
        l2Bridge: '0x5ceC0E2a1C46097eB30ddDdDE7bEa552F7a35a3f',
        l2HopBridgeToken: '0x19E8ff3C8048b5620adA58CBe90C31FB7364B23c',
        l2AmmWrapper: '0x7292d0d361d158a07b2bcDD56A4c5D1115c7347f',
        l2SaddleSwap: '0xbBd7842391Bd2f8FFa6b625eEC4491b7712DA814',
        l2SaddleLpToken: '0x61E6f7218BB823D45f8BDCB08673F0bD1cE7E6d1',
        l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        canonicalBridgeMaxPerTx: '10000'
      },
      optimism: {
        l1CanonicalBridge: '0xf8099DD44375Fdbb70D286af0fFCd46bA4B193dF',
        l1MessengerWrapper: '',
        l2CanonicalBridge: '0x82784078a7a8A1697BcCe5E07896C6a553846Bd5',
        l2CanonicalToken: '0xd4740F9cE3149b657D2457B6Ef29F953c2FcB479',
        l2Bridge: '0xc4fdda794DF56acCE772ABdcB2609Da8aF3650Cc',
        l2HopBridgeToken: '0xd945fdaC6Aa399c695BA9bAF66929dE958aE89FC',
        l2AmmWrapper: '0x1E99A04F2ed8AFC141cC4446BFebDe848E4EA3eF',
        l2SaddleSwap: '0x1dfA08a75F1e3f20386B1Dc17E538e5A0b24c792',
        l2SaddleLpToken: '0x2bd5a75cfe8BB6ac23b992Ca35Dea03ee14F76E3'
      }
    },
    DAI: {
      ethereum: {
        l1CanonicalToken: '0x436e3FfB93A4763575E5C0F6b3c97D5489E050da',
        l1Bridge: '0x2bd2fD36565f606F137a26522D62A24e3eB1a3fC'
      },
      xdai: {
        l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
        l1MessengerWrapper: '0x1DEf043c5f8031384E821fa52f5CaB6c4457f25b',
        l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
        l2CanonicalToken: '0x6D2d8B29d92cab87a273e872FcC4650A64116283',
        l2Bridge: '0x9536477898115fB208c2Be5401608f7682C4199C',
        l2HopBridgeToken: '0x5287847D9eBcdCa5AA9Ef09b139747C922F62b60',
        l2AmmWrapper: '0xfa99AF8fee036cAc25c304d84c2aBF301dA9632C',
        l2SaddleSwap: '0x0D857B24F7efd691d0C9eD9dE44963388198E438',
        l2SaddleLpToken: '0x70468FE8A5b0c960D75e75D0b5373f618C296EF5',
        l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        canonicalBridgeMaxPerTx: '10000'
      },
      optimism: {
        l1CanonicalBridge: '0xf8099DD44375Fdbb70D286af0fFCd46bA4B193dF',
        l1MessengerWrapper: '',
        l2CanonicalBridge: '0x82784078a7a8A1697BcCe5E07896C6a553846Bd5',
        l2CanonicalToken: '0x43AF508997d3b33555b3Cdc093a94b5DED06e306',
        l2Bridge: '0xc44E388abe0EC188A97B112C2F492a8Fd00a9A1E',
        l2HopBridgeToken: '0x720d42ac91109d5780F418c927ee045487cE3450',
        l2AmmWrapper: '0xaD33e2E73Fde9D4B8dAeDB957D5e8525aF3Fa553',
        l2SaddleSwap: '0xB91E5AC68DFf69a41905c48A1BAac3ca8BE7C7a3',
        l2SaddleLpToken: '0x518C1A4A882125c8EFEeA589C60cB924b5Df561c'
      }
    }
  }
}
