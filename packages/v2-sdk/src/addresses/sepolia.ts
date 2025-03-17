import { Addresses } from './types.js'

export const addresses: Addresses = {
  '11155111': { // Ethereum
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
      MOCK: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56',
      USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    }
  },
  '42069': { // Hub
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
      MOCK: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56',
      USDC: '0x9F6aCfA39A080d42E80db32F601F70894158039E'
    }
  },
  '11155420': { // Optimism
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
      MOCK: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56',
      USDC: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7'
    }
  },
  '84532': { // Base
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
      MOCK: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56',
      USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    }
  }
}
