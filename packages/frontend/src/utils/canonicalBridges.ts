import { EthBridger, Erc20Bridger, getL2Network } from '@arbitrum/sdk'
import {
  L1OptimismDaiTokenBridge,
  L1OptimismDaiTokenBridge__factory,
  L1OptimismGateway,
  L1OptimismGateway__factory,
  L1PolygonPlasmaBridgeDepositManager,
  L1PolygonPlasmaBridgeDepositManager__factory,
  L1PolygonPosRootChainManager,
  L1PolygonPosRootChainManager__factory,
  L1XDaiForeignOmniBridge,
  L1XDaiForeignOmniBridge__factory,
  L1XDaiPoaBridge,
  L1XDaiPoaBridge__factory,
  L1XDaiWETHOmnibridgeRouter,
  L1XDaiWETHOmnibridgeRouter__factory,
} from '@hop-protocol/core/contracts'
import { CanonicalToken, ChainId, ChainSlug, L2ChainSlug, Slug, TProvider } from '@hop-protocol/sdk'

export const canonicalBridges = {
  l1CanonicalToken: {
    ETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  polygon: {
    ETH: {
      nativeBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77', // Polygon (Matic): PoS Bridge (PoS RootChainManager)
      l2CanonicalToken: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // WETH
    },
    DAI: {
      nativeBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
      approveAddress: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf', // Polygon (Matic): ERC20 Bridge
      l2CanonicalToken: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // WDAI
    },
    MATIC: {
      nativeBridge: '0x401F6c983eA34274ec46f84D70b31C151321188b', // Polygon (Matic): Plasma Bridge
      l2CanonicalToken: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
    },
    USDC: {
      nativeBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
      approveAddress: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf', // Polygon (Matic): ERC20 Bridge
      l2CanonicalToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
    },
    USDT: {
      nativeBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
      approveAddress: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf', // Polygon (Matic): ERC20 Bridge
      l2CanonicalToken: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
    },
  },
  gnosis: {
    ETH: {
      nativeBridge: '0xa6439Ca0FCbA1d0F80df0bE6A17220feD9c9038a', // WETHOmnibridgeRouter
      l2CanonicalToken: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1', // WETH
    },
    DAI: {
      nativeBridge: '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016', // Gnosis Chain: xDai Bridge
      l2CanonicalToken: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // WXDAI
    },
    MATIC: {
      nativeBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671', // Gnosis Chain: Omni Bridge
      l2CanonicalToken: '0x7122d7661c4564b7C6Cd4878B06766489a6028A2', // MATIC
    },
    USDC: {
      nativeBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671', // Gnosis Chain: Omni Bridge
      l2CanonicalToken: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', // USDC
    },
    USDT: {
      nativeBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671', // Gnosis Chain: Omni Bridge
      l2CanonicalToken: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6', // USDT
    },
  },
  optimism: {
    ETH: {
      nativeBridge: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1', // Optimism: Gateway
      l2CanonicalToken: '0x4200000000000000000000000000000000000006', // WETH
    },
    DAI: {
      nativeBridge: '0x10E6593CDda8c58a1d0f14C5164B376352a55f2F', // Optimism: DAI nativeBridge
      l2CanonicalToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI
    },
    USDC: {
      nativeBridge: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1', // Optimism: Gateway
      l2CanonicalToken: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', // USDC
    },
    USDT: {
      nativeBridge: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1', // Optimism: Gateway
      l2CanonicalToken: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', // USDT
    },
  },
  arbitrum: {
    ETH: {
      nativeBridge: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f', // Arbitrum: Inbox
      l2CanonicalToken: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // WETH
    },
    DAI: {
      nativeBridge: '0xD3B5b60020504bc3489D6949d545893982BA3011', // Arbitrum: L1 DAI Gateway
      l2CanonicalToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI
    },
    USDC: {
      nativeBridge: '0xcEe284F754E854890e311e3280b767F80797180d', // Arbitrum: L1 Custom Gateway
      l2CanonicalToken: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC
    },
    USDT: {
      nativeBridge: '0xcEe284F754E854890e311e3280b767F80797180d', // Arbitrum: L1 Custom Gateway
      l2CanonicalToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT
    },
  },
}

export function getL1CanonicalTokenAddressBySymbol(tokenSymbol: CanonicalToken | string) {
  return canonicalBridges.l1CanonicalToken[tokenSymbol]
}

export function getNativeBridgeApproveAddress(
  l2ChainSlug: L2ChainSlug,
  tokenSymbol: CanonicalToken | string
): string {
  const token = canonicalBridges[l2ChainSlug as string]?.[tokenSymbol]
  return token?.approveAddress ?? token?.nativeBridge
}

export function getNativeBridgeAddress(
  l2ChainSlug: L2ChainSlug,
  tokenSymbol: CanonicalToken | string
): string {
  return canonicalBridges[l2ChainSlug as string]?.[tokenSymbol]?.nativeBridge
}

export function getL2CanonicalTokenAddressBySlug(
  l2ChainSlug: L2ChainSlug,
  tokenSymbol: CanonicalToken | string
): string {
  return canonicalBridges[l2ChainSlug as string]?.[tokenSymbol]?.l2CanonicalToken
}

export async function initNativeBridge(
  address: string,
  signer: TProvider,
  l2Chain: L2ChainSlug,
  token: CanonicalToken
) {
  switch (l2Chain) {
    case ChainSlug.Gnosis: {
      let bridge: L1XDaiPoaBridge | L1XDaiWETHOmnibridgeRouter | L1XDaiForeignOmniBridge
      if (token === CanonicalToken.DAI) {
        bridge = L1XDaiPoaBridge__factory.connect(address, signer)
      } else if (token === CanonicalToken.ETH) {
        bridge = L1XDaiWETHOmnibridgeRouter__factory.connect(address, signer)
      } else {
        bridge = L1XDaiForeignOmniBridge__factory.connect(address, signer)
      }
      return bridge
    }

    case ChainSlug.Optimism: {
      let bridge: L1OptimismDaiTokenBridge | L1OptimismGateway
      if (token === CanonicalToken.DAI) {
        bridge = L1OptimismDaiTokenBridge__factory.connect(address, signer)
      } else {
        bridge = L1OptimismGateway__factory.connect(address, signer)
      }
      return bridge
    }

    case ChainSlug.Arbitrum: {
      const l2Network = await getL2Network(ChainId.Arbitrum)
      let bridge: EthBridger | Erc20Bridger
      if (token === CanonicalToken.ETH) {
        bridge = new EthBridger(l2Network)
      } else {
        bridge = new Erc20Bridger(l2Network)
      }
      return bridge
    }

    case ChainSlug.Polygon: {
      let bridge: L1PolygonPlasmaBridgeDepositManager | L1PolygonPosRootChainManager
      if (token === CanonicalToken.MATIC) {
        bridge = L1PolygonPlasmaBridgeDepositManager__factory.connect(address, signer)
      } else {
        bridge = L1PolygonPosRootChainManager__factory.connect(address, signer)
      }
      return bridge
    }

    default: {
      throw new Error('Invalid L2 Chain')
    }
  }
}
