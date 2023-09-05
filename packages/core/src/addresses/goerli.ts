import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
    ETH: {
      ethereum: {
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        base: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      optimism: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        base: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      arbitrum: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        base: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      base: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      }
    }
  },
  bridges: {
    ETH: {
      ethereum: {
        l1CanonicalToken: '0x0000000000000000000000000000000000000000',
        l1Bridge: '0xC8A4FB931e8D77df8497790381CA7d228E68a41b',
        proxy: '0xb6E74faD6cDC60Cf6F28d9a6B490F43762F0ABF1',
        validator: '0x131F938FAAeAE5DD4497EEFF3D4FF3B0259A62a5',
        bridgeDeployedBlockNumber: 7393532
      },
      arbitrum: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0x4a55e8e407609A3046804ca500BeF6F5ebaCb6F9',
        l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l2CanonicalToken: '0xcb5ddfb8d0038247dc0beeecaa7f3457befcb77c',
        l2Bridge: '0xb276BC046DFf5024D20A3947475eA20C9F08eB1F',
        l2HopBridgeToken: '0x3F9880B2dF19aE17AdbdcD6a91a16fCd4a1A9D3D',
        l2AmmWrapper: '0xa832293f2DCe2f092182F17dd873ae06AD5fDbaF',
        l2SaddleSwap: '0x69a71b7F6Ff088a0310b4f911b4f9eA11e2E9740',
        l2SaddleLpToken: '0x8DC6D9fe4500D34A405414ed27e8Eb7Fd6889267',
        proxy: '0x07C592684Ee9f71D58853F9387579332d471b6Ca',
        validator: '0x70aF36240eC5040f6f9501E8E2D9db8703ec3d45',
        bridgeDeployedBlockNumber: 96936
      },
      optimism: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0x561285168e77f703C9B897d097D1B66a70D45687',
        l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
        l2CanonicalToken: '0xDc38c5aF436B9652225f92c370A011C673FA7Ba5',
        l2Bridge: '0x2708E5C7087d4C6D295c8B58b2D452c360D505C7',
        l2HopBridgeToken: '0xC8A4FB931e8D77df8497790381CA7d228E68a41b',
        l2AmmWrapper: '0xC1985d7a3429cDC85E59E2E4Fcc805b857e6Ee2E',
        l2SaddleSwap: '0xa50395bdEaca7062255109fedE012eFE63d6D402',
        l2SaddleLpToken: '0x2105a73D7739f1034Becc1bd87f4F7820d575644',
        proxy: '0x7191061D5d4C60f598214cC6913502184BAddf18',
        validator: '0xb3C68a491608952Cb1257FC9909a537a0173b63B',
        bridgeDeployedBlockNumber: 407263
      },
      base: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0xD8534e61A609B885B84eFBF607271c782c1D1660',
        l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
        l2CanonicalToken: '0x4200000000000000000000000000000000000006',
        l2Bridge: '0xCB4cEeFce514B2d910d3ac529076D18e3aDD3775',
        l2HopBridgeToken: '0x774502B60385065E16ffe1342F8a699a751585e9',
        l2AmmWrapper: '0xCbb852A6274e03fA00fb4895dE0463f66dF27a11',
        l2SaddleSwap: '0xB87aC009F61Fa214f196e232fD14A6f8AE422FA1',
        l2SaddleLpToken: '0x6Ad03376a15819c80b267038E2E4c00D35Cf8f67',
        proxy: '0x72209Fe68386b37A40d6bCA04f78356fd342491f',
        validator: '0xCB0a4177E0A60247C0ad18Be87f8eDfF6DD30283',
        bridgeDeployedBlockNumber: 1551608
      }
    }
  }
}
