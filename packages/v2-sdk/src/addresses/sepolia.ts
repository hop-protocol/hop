import { Addresses } from './types.js'
import { utils, BigNumber } from 'ethers'

const initialReserve = 10_000_000_000

export const initialReserves: Record<string, BigNumber> = {
  MOCK: utils.parseUnits(initialReserve.toString(), 18),
  USDC: utils.parseUnits(initialReserve.toString(), 6)
}

export const addresses: Addresses = {
  '11155111': { // Seploia
    initialReserves,
    chainId: '11155111',
    startBlock: 7897346,
    hubCoreMessenger: '0xe4e95dc6ead1F78E2302812D6aE1994Fd4De407d', // dispatcher
    spokeCoreMessenger: '0xe4e95dc6ead1F78E2302812D6aE1994Fd4De407d', // dispatcher
    ethFeeDistributor: '', // empty
    railsGateway: '0x638BE68765dE7eb4574eb60B4AF79D7AD75edcdF',
    dispatcher: '0xe4e95dc6ead1F78E2302812D6aE1994Fd4De407d',
    transporter: '0x08cD9b2afcE41F93Cfe89338De090e582f25cadf',
    executor: '0x32F1f3Fc0fB907791dC5c15EF8111808231cA608',
    stakingRegistry: '0x48013162D54DF91Fa0916D107366FE9D0D2b1D39',
    hopToken: '0x236F2dD02A8dd1DbdC62C648cCE0F3615278beab',
    tokens: {
      MOCK: {
        address: '0x486910D137fA39e6B7b106a13C305F13e8219624',
        railsPaths: {
          '11155420': {
            pathId: '0xf2562f695ac4ba9361f3c5f05041d5f53ec86062b47561fe0d9f29e1675b5ace',
          },
          '84532': {
            pathId: '0xa09d30aa916c4d894c72246d122110004aabd43fd09206c02549a5dd0122b198',
          }
        }
      },
      USDC: {
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        railsPaths: {
          '11155420': {
            pathId: '0x3541ab0d01eacfd4bf63a96f8651aef9db4396ab9944d3acada716c2378cb07f',
          },
          '84532': {
            pathId: '0x1da48538be012466f4dd90504bb95a5b22e96796fd4d78b4fde7a4ee9dc4aa8',
          }
        }
      }
    }
  },
  '11155420': { // Optimism Seploia
    initialReserves,
    chainId: '11155420',
    startBlock: 25056143,
    spokeCoreMessenger: '0xe4e95dc6ead1F78E2302812D6aE1994Fd4De407d', // dispatcher
    railsGateway: '0x638BE68765dE7eb4574eb60B4AF79D7AD75edcdF',
    dispatcher: '0xe4e95dc6ead1F78E2302812D6aE1994Fd4De407d',
    transporter: '0x08cD9b2afcE41F93Cfe89338De090e582f25cadf',
    executor: '0x32F1f3Fc0fB907791dC5c15EF8111808231cA608',
    stakingRegistry: '0x48013162D54DF91Fa0916D107366FE9D0D2b1D39',
    hopToken: '0x236F2dD02A8dd1DbdC62C648cCE0F3615278beab',
    tokens: {
      MOCK: {
        address: '0x486910D137fA39e6B7b106a13C305F13e8219624',
        railsPaths: {
          '11155111': {
            pathId: '0xf2562f695ac4ba9361f3c5f05041d5f53ec86062b47561fe0d9f29e1675b5ace',
          },
          '84532': {
            pathId: '0xaeb584e28dabc839c89e66876cc40dba92e503206ceb71ced70990821a03f734',
          }
        }
      },
      USDC: {
        address: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
        railsPaths: {
          '11155111': {
            pathId: '0x3541ab0d01eacfd4bf63a96f8651aef9db4396ab9944d3acada716c2378cb07f',
          },
          '84532': {
            pathId: '0xd2d47e6d4c2b36ee88f1db857ba436161744b1348b41bb48ef4457a830ea3c18',
          }
        }
      }
    }
  },
  '84532': { // Base Seploia
    initialReserves,
    chainId: '84532',
    startBlock: 23073292,
    spokeCoreMessenger: '0xe4e95dc6ead1F78E2302812D6aE1994Fd4De407d', // dispatcher
    railsGateway: '0x638BE68765dE7eb4574eb60B4AF79D7AD75edcdF',
    dispatcher: '0xe4e95dc6ead1F78E2302812D6aE1994Fd4De407d',
    transporter: '0x08cD9b2afcE41F93Cfe89338De090e582f25cadf',
    executor: '0x32F1f3Fc0fB907791dC5c15EF8111808231cA608',
    stakingRegistry: '0x48013162D54DF91Fa0916D107366FE9D0D2b1D39',
    hopToken: '0x236F2dD02A8dd1DbdC62C648cCE0F3615278beab',
    tokens: {
      MOCK: {
        address: '0x486910D137fA39e6B7b106a13C305F13e8219624',
        railsPaths: {
          '11155111': {
            pathId: '0xa09d30aa916c4d894c72246d122110004aabd43fd09206c02549a5dd0122b198',
          },
          '11155420': {
            pathId: '0xaeb584e28dabc839c89e66876cc40dba92e503206ceb71ced70990821a03f734',
          }
        }
      },
      USDC: {
        address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        railsPaths: {
          '11155111': {
            pathId: '0x1da48538be012466f4dd90504bb95a5b22e96796fd4d78b4fde7a4ee9dc4aa8',
          },
          '11155420': {
            pathId: '0xd2d47e6d4c2b36ee88f1db857ba436161744b1348b41bb48ef4457a830ea3c18',
          }
        }
      }
    }
  }
}