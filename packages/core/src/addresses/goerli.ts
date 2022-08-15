import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
    ETH: {
      ethereum: {
        polygon: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      polygon: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      optimism: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        polygon: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      arbitrum: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        polygon: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      }
    },
    USDC: {
      ethereum: {
        polygon: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      polygon: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      optimism: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        polygon: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      arbitrum: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        polygon: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      }
    }
  },
  bridges: {
    ETH: {
      ethereum: {
        l1CanonicalToken: '0x0000000000000000000000000000000000000000',
        l1Bridge: '0xC8A4FB931e8D77df8497790381CA7d228E68a41b',
        bridgeDeployedBlockNumber: 7393532
      },
      polygon: {
        l1CanonicalBridge: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1MessengerWrapper: '0xF7C52d88A1D39966C22F9e07A61f43f61eC1eF1d',
        l2CanonicalBridge: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
        l2CanonicalToken: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
        l2Bridge: '0x34E8251051687BfF4EA23C18e466b3Ed13492abd',
        l2HopBridgeToken: '0xD063875762e760Ee787b11F6Af624058b4841A5a',
        l2AmmWrapper: '0x0e0E3d2C5c292161999474247956EF542caBF8dd',
        l2SaddleSwap: '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a',
        l2SaddleLpToken: '0x307C0fc195e1ddc927ee73856558Ab8C9297B3FB',
        l1FxBaseRootTunnel: '0xF7C52d88A1D39966C22F9e07A61f43f61eC1eF1d',
        l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1PosPredicate: '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34',
        l2MessengerProxy: '0x0a6b1904369fE59E002ad0713ae89d4E3dF5A7Cf',
        bridgeDeployedBlockNumber: 27594937
      },
      arbitrum: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0x2ad09850b0CA4c7c1B33f5AcD6cBAbCaB5d6e796',
        l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l2CanonicalToken: '0xcb5ddfb8d0038247dc0beeecaa7f3457befcb77c',
        l2Bridge: '0xb276BC046DFf5024D20A3947475eA20C9F08eB1F',
        l2HopBridgeToken: '0x3F9880B2dF19aE17AdbdcD6a91a16fCd4a1A9D3D',
        l2AmmWrapper: '0xa832293f2DCe2f092182F17dd873ae06AD5fDbaF',
        l2SaddleSwap: '0x69a71b7F6Ff088a0310b4f911b4f9eA11e2E9740',
        l2SaddleLpToken: '0x8DC6D9fe4500D34A405414ed27e8Eb7Fd6889267',
        bridgeDeployedBlockNumber: 96936
      },
      optimism: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0x067ccEaf99b0Eb154DeaCBAa852C21dDB19F2f7F',
        l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
        l2CanonicalToken: '0xDc38c5aF436B9652225f92c370A011C673FA7Ba5',
        l2Bridge: '0x2708E5C7087d4C6D295c8B58b2D452c360D505C7',
        l2HopBridgeToken: '0xC8A4FB931e8D77df8497790381CA7d228E68a41b',
        l2AmmWrapper: '0xC1985d7a3429cDC85E59E2E4Fcc805b857e6Ee2E',
        l2SaddleSwap: '0xa50395bdEaca7062255109fedE012eFE63d6D402',
        l2SaddleLpToken: '0x2105a73D7739f1034Becc1bd87f4F7820d575644',
        bridgeDeployedBlockNumber: 407263
      }
    },
    USDC: {
      ethereum: {
        l1CanonicalToken: '0x98339D8C260052B7ad81c28c16C0b98420f2B46a',
        l1Bridge: '0x7D269D3E0d61A05a0bA976b7DBF8805bF844AF3F',
        bridgeDeployedBlockNumber: 7398216
      },
      polygon: {
        l1CanonicalBridge: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1MessengerWrapper: '0x7aA3c554500E562D0ab26d756473D201e9051dFD',
        l2CanonicalBridge: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
        l2CanonicalToken: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
        l2Bridge: '0x3c0FFAca566fCcfD9Cc95139FEF6CBA143795963',
        l2HopBridgeToken: '0x5C32143C8B198F392d01f8446b754c181224ac26',
        l2AmmWrapper: '0xa81D244A1814468C734E5b4101F7b9c0c577a8fC',
        l2SaddleSwap: '0x76b22b8C1079A44F1211D867D68b1eda76a635A7',
        l2SaddleLpToken: '0x4a1a092BFFA8514E7F07ea3980C0be12139EFfFb',
        l1FxBaseRootTunnel: '0x7aA3c554500E562D0ab26d756473D201e9051dFD',
        l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1PosPredicate: '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34',
        l2MessengerProxy: '0xCB0a4177E0A60247C0ad18Be87f8eDfF6DD30283',
        bridgeDeployedBlockNumber: 27606309
      },
      arbitrum: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0xe28EA9254a9A433EC4E92227c498A1CeAD8210C2',
        l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l2CanonicalToken: '0x17078F231AA8dc256557b49a8f2F72814A71f633',
        l2Bridge: '0x86cA30bEF97fB651b8d866D45503684b90cb3312',
        l2HopBridgeToken: '0x30E344C8F517becAEEd04245ceD2e7301f06f21b',
        l2AmmWrapper: '0x32219766597DFbb10297127238D921E7CCF5D920',
        l2SaddleSwap: '0x83f6244Bd87662118d96D9a6D44f09dffF14b30E',
        l2SaddleLpToken: '0xaD884FacB295EBfF185e215b52346909C7C3198E',
        bridgeDeployedBlockNumber: 97011
      },
      optimism: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0xe7F40BF16AB09f4a6906Ac2CAA4094aD2dA48Cc2',
        l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
        l2CanonicalToken: '0xCB4cEeFce514B2d910d3ac529076D18e3aDD3775',
        l2Bridge: '0x76b22b8C1079A44F1211D867D68b1eda76a635A7',
        l2HopBridgeToken: '0x72209Fe68386b37A40d6bCA04f78356fd342491f',
        l2AmmWrapper: '0xfF21e82a4Bc305BCE591530A68628192b5b6B6FD',
        l2SaddleSwap: '0xE4757dD81AFbecF61E51824AB9238df6691c3D0e',
        l2SaddleLpToken: '0xac1621E4C005D2dE18cD0CB226c60a4d94aE474E',
        bridgeDeployedBlockNumber: 407913
      }
    }
  }
}
