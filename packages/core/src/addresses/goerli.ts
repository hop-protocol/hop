import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
    ETH: {
      ethereum: {
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        base: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        linea: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        polygonzk: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      optimism: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        base: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        linea: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        polygonzk: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      arbitrum: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        base: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        linea: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        polygonzk: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      base: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        linea: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        polygonzk: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      linea: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        base: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        polygonzk: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
      },
      polygonzk: {
        ethereum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        optimism: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        arbitrum: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        linea: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7',
        base: '0x81682250D4566B2986A2B33e23e7c52D401B7aB7'
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
        bridgeDeployedBlockNumber: 1551608
      },
      linea: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0xa91405Ee423a27C305A6B5f4B54d5B8bB2E8728D',
        l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l2CanonicalToken: '0x2C1b868d6596a18e32E61B901E4060C872647b6C',
        l2Bridge: '0x893246FACF345c99e4235E5A7bbEE7404c988b96',
        l2HopBridgeToken: '0x8212Fb83CF51C5bd1333b5f063222E338C86F064',
        l2AmmWrapper: '0x30ca9afabA0DA59F507756cA43619f96f176d214',
        l2SaddleSwap: '0x1Be8d7851d64BC296e9E941F414f9a6635b5D830',
        l2SaddleLpToken: '0x5f6Eb0641D6Bcd7352cC628B42e72901d5336822',
        bridgeDeployedBlockNumber: 1904158
      },
      polygonzk: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0x58A3457C395E76c49cF65C25677F8E7136AF5Cc2',
        l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l2CanonicalToken: '0x0EEFEe679a77dC411579e520ef7535d526cED1d6',
        l2Bridge: '0x172cAbe34c757472249aD4Bd97560373fBbf0DA3',
        l2HopBridgeToken: '0x97A44f0Fe5fcF7D263dE103e8bbECBefF788BE6F',
        l2AmmWrapper: '0x115F423b958A2847af0F5bF314DB0f27c644c308',
        l2SaddleSwap: '0xe5b6bD410caaBC232c8fAb45002d5F2912A51426',
        l2SaddleLpToken: '0xb5E87a0Cd0dcB09308f4DB0ea56884a8005097B3',
        bridgeDeployedBlockNumber: 3615908
      }
    },
    USDC: {
      ethereum: {
        l1CanonicalToken: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        l1Bridge: '0x93fa781d2b639804005e48122208b000a868db37' // TODO cctp address
      },
      optimism: {
        l2CanonicalToken: '0xe05606174bac4a6364b31bd0eca4bf4dd368f8c6',
        l2Bridge: '' // TODO cctp address
      },
      arbitrum: {
        l2CanonicalToken: '0xfd064a18f3bf249cf1f87fc203e90d8f650f2d63',
        l2Bridge: '' // TODO cctp address
      },
    },
  }
}
