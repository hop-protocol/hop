import { Addresses } from './types.js'

export const addresses: Addresses = {
  '11155111': { // Ethereum
    chainId: '11155111',
    startBlock: 7314773,
    hubCoreMessenger: '0x633e8AB656adc4Ae3aAbbE2494B42a4Da8586858', // dispatcher
    spokeCoreMessenger: '0x633e8AB656adc4Ae3aAbbE2494B42a4Da8586858', // dispatcher
    ethFeeDistributor: '', // empty
    railsGateway: '0x39b4CC7E096dd67D9Fd2B72b906ca5d2D48ac0c1',
    dispatcher: '0x633e8AB656adc4Ae3aAbbE2494B42a4Da8586858',
    transporter: '0xbAa5d5E1DDAAcD5a3fA816d5d66d0e7a50e097F8',
    executor: '0x4283CE82aa0F08661b58e3c34F2bB18318bc17CD',
    stakingRegistry: '',
    tokens: {
      MOCK: '0xDCAc09AbB4D3E008b941370d384d0Cf20ce0a5bd',
      USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    }
  },
  '11155420': { // Optimism
    chainId: '11155420',
    startBlock: 21427260,
    spokeCoreMessenger: '0x633e8AB656adc4Ae3aAbbE2494B42a4Da8586858', // dispatcher
    railsGateway: '0x39b4CC7E096dd67D9Fd2B72b906ca5d2D48ac0c1',
    dispatcher: '0x633e8AB656adc4Ae3aAbbE2494B42a4Da8586858',
    transporter: '0xbAa5d5E1DDAAcD5a3fA816d5d66d0e7a50e097F8',
    executor: '0x4283CE82aa0F08661b58e3c34F2bB18318bc17CD',
    stakingRegistry: '0xbc4387425E2eDAf51E770f6F8c4fAd28352Bca64',
    hopToken: '0x9F6aCfA39A080d42E80db32F601F70894158039E',
    tokens: {
      MOCK: '0xDCAc09AbB4D3E008b941370d384d0Cf20ce0a5bd',
      USDC: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7'
    }
  },
  '84532': { // Base
    chainId: '84532',
    startBlock: 19444401,
    spokeCoreMessenger: '0x633e8AB656adc4Ae3aAbbE2494B42a4Da8586858', // dispatcher
    railsGateway: '0x39b4CC7E096dd67D9Fd2B72b906ca5d2D48ac0c1',
    dispatcher: '0x633e8AB656adc4Ae3aAbbE2494B42a4Da8586858',
    transporter: '0xbAa5d5E1DDAAcD5a3fA816d5d66d0e7a50e097F8',
    executor: '0x4283CE82aa0F08661b58e3c34F2bB18318bc17CD',
    stakingRegistry: '',
    tokens: {
      MOCK: '0xDCAc09AbB4D3E008b941370d384d0Cf20ce0a5bd',
      USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    }
  },
  '42069': { // Hub Chain
    chainId: '42069',
    startBlock: 3368530,
    spokeCoreMessenger: '0x633e8AB656adc4Ae3aAbbE2494B42a4Da8586858', // dispatcher
    railsGateway: '0x39b4CC7E096dd67D9Fd2B72b906ca5d2D48ac0c1',
    dispatcher: '0x633e8AB656adc4Ae3aAbbE2494B42a4Da8586858',
    transporter: '0xbAa5d5E1DDAAcD5a3fA816d5d66d0e7a50e097F8',
    executor: '0x4283CE82aa0F08661b58e3c34F2bB18318bc17CD',
    stakingRegistry: '',
    tokens: {
      MOCK: '0xDCAc09AbB4D3E008b941370d384d0Cf20ce0a5bd',
      USDC: '0x36d3f5501Ef2BA0ea329c46C5A4a463C163e1ff0'
    }
  }
}
