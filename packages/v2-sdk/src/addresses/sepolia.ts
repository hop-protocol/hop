import { Addresses } from './types.js'

export const addresses: Addresses = {
  '11155111': { // ETH
    chainId: '11155111',
    startBlock: 6834872,
    hubCoreMessenger: '0x7C1A5F9BeaB3d282C1495CB91BF72d9BE75C7530', // dispatcher
    spokeCoreMessenger: '0x7C1A5F9BeaB3d282C1495CB91BF72d9BE75C7530', // dispatcher
    ethFeeDistributor: '',
    railsGateway: '0xad3631401B9ef310B1D4e3EF6B499b24b38B544A',
    dispatcher: '0x7C1A5F9BeaB3d282C1495CB91BF72d9BE75C7530',
    transporter: '0x4cb73eBee9d718EDe0275683043Ac4A276E69915',
    executor: '0xcdE5B3965531B8dE938D06Cdd8a6a09616825084',
    tokens: {
      MOCK: '0x90C1d7021D027c5665413074f34a8bACb3a57688',
      USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    }
  },
  '11155420': { // OP
    chainId: '11155420',
    startBlock: 18270304,
    spokeCoreMessenger: '0x7C1A5F9BeaB3d282C1495CB91BF72d9BE75C7530', // dispatcher
    railsGateway: '0xad3631401B9ef310B1D4e3EF6B499b24b38B544A',
    dispatcher: '0x7C1A5F9BeaB3d282C1495CB91BF72d9BE75C7530',
    transporter: '0x4cb73eBee9d718EDe0275683043Ac4A276E69915',
    executor: '0xcdE5B3965531B8dE938D06Cdd8a6a09616825084',
    tokens: {
      MOCK: '0x90C1d7021D027c5665413074f34a8bACb3a57688',
      USDC: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7'
    }
  },
  '84532': { // BASE
    chainId: '84532',
    startBlock: 16287450,
    spokeCoreMessenger: '0x7C1A5F9BeaB3d282C1495CB91BF72d9BE75C7530', // dispatcher
    railsGateway: '0xad3631401B9ef310B1D4e3EF6B499b24b38B544A',
    dispatcher: '0x7C1A5F9BeaB3d282C1495CB91BF72d9BE75C7530',
    transporter: '0x4cb73eBee9d718EDe0275683043Ac4A276E69915',
    executor: '0xcdE5B3965531B8dE938D06Cdd8a6a09616825084',
    tokens: {
      MOCK: '0x90C1d7021D027c5665413074f34a8bACb3a57688',
      USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    }
  },
  '42069': { // HUB
    chainId: '42069',
    startBlock: 211421,
    spokeCoreMessenger: '0x7C1A5F9BeaB3d282C1495CB91BF72d9BE75C7530', // dispatcher
    railsGateway: '0xad3631401B9ef310B1D4e3EF6B499b24b38B544A',
    dispatcher: '0x7C1A5F9BeaB3d282C1495CB91BF72d9BE75C7530',
    transporter: '0x4cb73eBee9d718EDe0275683043Ac4A276E69915',
    executor: '0xcdE5B3965531B8dE938D06Cdd8a6a09616825084',
    tokens: {
      MOCK: '0x90C1d7021D027c5665413074f34a8bACb3a57688',
      USDC: '0x36d3f5501Ef2BA0ea329c46C5A4a463C163e1ff0'
    }
  }
}
