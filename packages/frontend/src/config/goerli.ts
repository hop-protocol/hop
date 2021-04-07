import { HopAddresses } from './interfaces'

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '0xCc60875df511a36d9b9A4ae7f20f55d1B89EbcE2',
    stakingRewardsFactory: '0x8714CFE33dA280Ab990D1aCD33F1E7caF541dce4',
    stakingRewards: '0xdB33bf4a7b76b459407Fc5849c33AE9763D66895',
    governorAlpha: '0xadcdb487C45bCB517D3873Bb54F2e01942e4e1d5'
  },
  tokens: {
    DAI: {
      kovan: {
        l1CanonicalToken: '0x436e3FfB93A4763575E5C0F6b3c97D5489E050da',
        l1Bridge: '0x7d3101fE93Ff6dC009c2f50b6aD59DDD7F23dC5F'
      },
      optimism: {
        l1CanonicalBridge: '0xC1e7Be0E1aDD345afB2485aA5E774cD79cBbbBf5',
        l2CanonicalBridge: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
        l2CanonicalToken: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
        l2Bridge: '0xd6935d3FE65f804e54a8e0d0A0F8793f0aC196Ff',
        l2HopBridgeToken: '0x761ac04A47076eadf2BfAF545e2B101C8417498e',
        l2UniswapWrapper: '0x6523C434ce2a4AAf168FD59a1d6074772C9a15bE',
        l2UniswapRouter: '0x8D65D4160559493b0a687ED5Ae39dcce88cB5cFc',
        l2UniswapFactory: '0x6523C434ce2a4AAf168FD59a1d6074772C9a15bE',
        l2UniswapExchange: '0xBEa657cb5BD947811694882A821F7EC08370c252'
      },
      xdai: {
        l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
        l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
        l2CanonicalToken: '0x714983a8Dc3329bf3BeB8F36b49878CF944E5A3B',
        l2Bridge: '0xc638F45C59DBD449173266Cd2c47E9670630F013',
        l2HopBridgeToken: '0x66CC0844797349801984323Ed0c0Cac0d81290E9',
        l2UniswapWrapper: '0x8E692A638Ac9Ab55C8224175C60EBF9a17dba372',
        l2UniswapRouter: '0x85a288Dd75BE15b4C839BAEcbC6cAd2F2889aB5a',
        l2UniswapFactory: '0xA672420F4779f26Db86dD5bB5711F86B6d6e5a1f',
        l2UniswapExchange: '0x1A48d744b738c9a045a18A129E253361775512De',
        l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        canonicalBridgeMaxPerTx: '10000'
      }
    },
    USDC: {
      kovan: {
        l1CanonicalToken: '0x7326510Cf9Ae0397dbBaF37FABba54f0A7b8D100',
        l1Bridge: '0xb8d5B8c70E5727b633b96E89310fa3Cf12ff2985'
      },
      optimism: {
        l1CanonicalBridge: '0xC1e7Be0E1aDD345afB2485aA5E774cD79cBbbBf5',
        l2CanonicalBridge: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
        l2CanonicalToken: '0x56836Eec6d4EfCcFBc162C0851007D9F72aD202B',
        l2Bridge: '0x6a4DCaF6074C02F61d5C65A243626DDE01bD4578',
        l2HopBridgeToken: '0x8C295068Cd136C348F90f9f31C85A5c61Ed490Bc',
        l2UniswapWrapper: '0x7C82b921EF93C1A9aa186B31E2c5f7A57c1BFBf5',
        l2UniswapRouter: '0xF33A86e3c4Ba3117d12560fF6e707d3e1F1D1aaa',
        l2UniswapFactory: '0x2441244C710c9482099ddfd779D9b2725D5a4D1d',
        l2UniswapExchange: '0x2ae000013ad6AbF276616D474804f9E899C2e835'
      },
      xdai: {
        l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
        l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
        l2CanonicalToken: '0x452AED3fdB2E83A1352624321629180aB1489Dd0',
        l2Bridge: '0xa66EAC1286a6D29C0AFd8db916f7225a10C820e7',
        l2HopBridgeToken: '0x2fC3F8d004Ed084f2c17c10eAb1a54Bb1946B313',
        l2UniswapWrapper: '0xb7A075F9f1920a2E80Bf1485851500c767D261BE',
        l2UniswapRouter: '0xaAFBDF173bF2d618842c8Adc972E44FC8f9A74B0',
        l2UniswapFactory: '0x937f6D245D1b20123fb51A5d1B53fE7e60D3C429',
        l2UniswapExchange: '0xa210620A202193308E4770681ef2cC38058f4624',
        l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        canonicalBridgeMaxPerTx: '10000'
      }
    },
    WBTC: {
      kovan: {
        l1CanonicalToken: '0x1E1a556D2166A006e662864D376e8DD249087150',
        l1Bridge: '0xA93eC98Ead897Ee8EF0b5CC9E2a658875719B224'
      },
      optimism: {
        l1CanonicalBridge: '0xC1e7Be0E1aDD345afB2485aA5E774cD79cBbbBf5',
        l2CanonicalBridge: '0x782e1ec5F7381269b2e5DC4eD58648C60161539b',
        l2CanonicalToken: '0x067ca83e321979E31b06250E05d18a12e4f6A8f1',
        l2Bridge: '0xdea7dfCE1AA07D7A8DBd063f4128d83c183f8c27',
        l2HopBridgeToken: '0xaa59aA02Da4a3FF0B7d114442321fC9012e64E4D',
        l2UniswapWrapper: '0x2289f8dBb6B87854C24b6f2CdB38274db3067DB6',
        l2UniswapRouter: '0x4816544201cFBcc44877eF4b3A32532d8f2083cB',
        l2UniswapFactory: '0x0e52E03E37f0aa5e0150433D456a0E479B68F3a9',
        l2UniswapExchange: '0x510a2e11a7c025f3323B08a9056198c19Eb52F68'
      },
      xdai: {
        l1CanonicalBridge: '0xA960d095470f7509955d5402e36d9DB984B5C8E2',
        l2CanonicalBridge: '0x40CdfF886715A4012fAD0219D15C98bB149AeF0e',
        l2CanonicalToken: '0x94490EF228D4aBD189694f86D1684D972431380b',
        l2Bridge: '0xbf4afb067Cdd452EC80f75862b2C6D39FeB96476',
        l2HopBridgeToken: '0xC1e7Be0E1aDD345afB2485aA5E774cD79cBbbBf5',
        l2UniswapWrapper: '0xEae1996B0d2E337B4D345Db2e8D5786c1a0D0C2D',
        l2UniswapRouter: '0x325aD30CA387f845D5D9bb3e0a9E4c061b5ACc3A',
        l2UniswapFactory: '0x7EE6109672c07Dcf97435C8238835EFF5D6E89FD',
        l2UniswapExchange: '0xF61999a672E4D90CDC587b79b2c86AdBb66294D1',
        l1Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        l2Amb: '0xFe446bEF1DbF7AFE24E81e05BC8B271C1BA9a560',
        canonicalBridgeMaxPerTx: '10000'
      }
    }
  }
}
