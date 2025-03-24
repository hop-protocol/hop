import { Addresses } from './types.js'
import { utils, BigNumber } from 'ethers'

const initialReserve = 10_000_000_000

export const initialReserves: Record<string, BigNumber> = {
  MOCK: utils.parseUnits(initialReserve.toString(), 18),
  USDC: utils.parseUnits(initialReserve.toString(), 6)
}

export const addresses: Addresses = {
  '11155111': { // Ethereum
    initialReserves,
    chainId: '11155111',
    startBlock: 7897346,
    hubCoreMessenger: '0xec6820f86804c4fa52453be4Fd0D30c436b527A4', // dispatcher
    spokeCoreMessenger: '0xec6820f86804c4fa52453be4Fd0D30c436b527A4', // dispatcher
    ethFeeDistributor: '', // empty
    railsGateway: '0x8b544B919Ca620d41f87d234e5Bd3C9c06E1ad9D',
    dispatcher: '0xec6820f86804c4fa52453be4Fd0D30c436b527A4',
    transporter: '0x767576DF19aC7636a30276760f220157ca44586E',
    executor: '0x61C08376C91385Ef68467eF905f73874fA0d5CB6',
    stakingRegistry: '0xa65BA5E806Ffde410EAdAd6e07FA07e58683d8b6',
    hopToken: '0xF5505ED806FB7F0d13f90d6e53D59cc2153a4aEd',
    tokens: {
      MOCK: {
        address: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56',
        railsPaths: {
          '42069': {
            pathId: '0x548cef5cfe8ecabab46bfec342ef722f201a04630dc7f9ae2327dd66d916fa3f',
          },
          '11155420': {
            pathId: '0x548cef5cfe8ecabab46bfec342ef722f201a04630dc7f9ae2327dd66d916fa3f',
          },
          '84532': {
            pathId: '0x86649d3e4cb1d29f562051ebf7bcc10ea6c69853f76064aa4674c933ec7a53b2',
          }
        }
      },
      USDC: {
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        railsPaths: {
          '42069': {
            pathId: '0xb11d88d122abd5a39e0015594ed52eb5e161a10f74430c032a692c0ddbcce6ba',
          },
          '11155420': {
            pathId: '0x3541ab0d01eacfd4bf63a96f8651aef9db4396ab9944d3acada716c2378cb07f',
          },
          '84532': {
            pathId: '0x01da48538be012466f4dd90504bb95a5b22e96796fd4d78b4fde7a4ee9dc4aa8',
          }
        }
      }
    }
  },
  '42069': { // Hub
    initialReserves,
    chainId: '42069',
    startBlock: 6620616,
    hubCoreMessenger: '0xec6820f86804c4fa52453be4Fd0D30c436b527A4', // dispatcher
    railsGateway: '0x8b544B919Ca620d41f87d234e5Bd3C9c06E1ad9D',
    dispatcher: '0xec6820f86804c4fa52453be4Fd0D30c436b527A4',
    transporter: '0x767576DF19aC7636a30276760f220157ca44586E',
    executor: '0x61C08376C91385Ef68467eF905f73874fA0d5CB6',
    stakingRegistry: '0xa65BA5E806Ffde410EAdAd6e07FA07e58683d8b6',
    hopToken: '0x9F6aCfA39A080d42E80db32F601F70894158039E',
    tokens: {
      MOCK: {
        address: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56',
        railsPaths: {
          '11155111': {
            pathId: '0x548cef5cfe8ecabab46bfec342ef722f201a04630dc7f9ae2327dd66d916fa3f',
          },
          '11155420': {
            pathId: '0xd5c426055ea754595f988b34f49a5c9db2ced10a3b33b3a5317e6e3b39892582',
          },
          '84532': {
            pathId: '0x4a216377b73851e314b778e848aa68391344794677f9853def38e30f7795c262',
          }
        }
      },
      USDC: {
        address: '0x9F6aCfA39A080d42E80db32F601F70894158039E',
        railsPaths: {
          '11155111': {
            pathId: '0xb11d88d122abd5a39e0015594ed52eb5e161a10f74430c032a692c0ddbcce6ba',
          },
          '11155420': {
            pathId: '0xf62ba159a0d86df28c37f212a589d45ea6a507a286c21441e509914afd2f9470',
          },
          '84532': {
            pathId: '0xad7a8a28d4cef1b36c7fbd1ee514311fc4bb66107617e9bb6056644faa114bfe',
          }
        }
      }
    }
  },
  '11155420': { // Optimism,
    initialReserves,
    chainId: '11155420',
    startBlock: 25056143,
    spokeCoreMessenger: '0xec6820f86804c4fa52453be4Fd0D30c436b527A4', // dispatcher
    railsGateway: '0x8b544B919Ca620d41f87d234e5Bd3C9c06E1ad9D',
    dispatcher: '0xec6820f86804c4fa52453be4Fd0D30c436b527A4',
    transporter: '0x767576DF19aC7636a30276760f220157ca44586E',
    executor: '0x61C08376C91385Ef68467eF905f73874fA0d5CB6',
    stakingRegistry: '0xa65BA5E806Ffde410EAdAd6e07FA07e58683d8b6',
    hopToken: '0xF5505ED806FB7F0d13f90d6e53D59cc2153a4aEd',
    tokens: {
      MOCK: {
        address: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56',
        railsPaths: {
          '11155111': {
            pathId: '0x5bc2ef90735775e882cfbd8d1a435d9d857cd4b44c30c0c00fb7d8188d0c61a8',
          },
          '42069': {
            pathId: '0xd5c426055ea754595f988b34f49a5c9db2ced10a3b33b3a5317e6e3b39892582',
          },
          '84532': {
            pathId: '0x50f1df98039398d91f00794eb591408d100c9f699488086e1986ee92d5c93346',
          }
        }
      },
      USDC: {
        address: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
        railsPaths: {
          '11155111': {
            pathId: '0x3541ab0d01eacfd4bf63a96f8651aef9db4396ab9944d3acada716c2378cb07f',
          },
          '42069': {
            pathId: '0xf62ba159a0d86df28c37f212a589d45ea6a507a286c21441e509914afd2f9470',
          },
          '84532': {
            pathId: '0xd2d47e6d4c2b36ee88f1db857ba436161744b1348b41bb48ef4457a830ea3c18',
          }
        }
      }
    }
  },
  '84532': { // Base
    initialReserves,
    chainId: '84532',
    startBlock: 23073292,
    spokeCoreMessenger: '0xec6820f86804c4fa52453be4Fd0D30c436b527A4', // dispatcher
    railsGateway: '0x8b544B919Ca620d41f87d234e5Bd3C9c06E1ad9D',
    dispatcher: '0xec6820f86804c4fa52453be4Fd0D30c436b527A4',
    transporter: '0x767576DF19aC7636a30276760f220157ca44586E',
    executor: '0x61C08376C91385Ef68467eF905f73874fA0d5CB6',
    stakingRegistry: '0xa65BA5E806Ffde410EAdAd6e07FA07e58683d8b6',
    hopToken: '0xF5505ED806FB7F0d13f90d6e53D59cc2153a4aEd',
    tokens: {
      MOCK: {
        address: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56',
        railsPaths: {
          '11155111': {
            pathId: '0x86649d3e4cb1d29f562051ebf7bcc10ea6c69853f76064aa4674c933ec7a53b2',
          },
          '42069': {
            pathId: '0x4a216377b73851e314b778e848aa68391344794677f9853def38e30f7795c262',
          },
          '11155420': {
            pathId: '0x50f1df98039398d91f00794eb591408d100c9f699488086e1986ee92d5c93346',
          }
        }
      },
      USDC: {
        address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        railsPaths: {
          '11155111': {
            pathId: '0x01da48538be012466f4dd90504bb95a5b22e96796fd4d78b4fde7a4ee9dc4aa8',
          },
          '42069': {
            pathId: '0xad7a8a28d4cef1b36c7fbd1ee514311fc4bb66107617e9bb6056644faa114bfe',
          },
          '11155420': {
            pathId: '0xd2d47e6d4c2b36ee88f1db857ba436161744b1348b41bb48ef4457a830ea3c18',
          }
        }
      }
    }
  }
}
