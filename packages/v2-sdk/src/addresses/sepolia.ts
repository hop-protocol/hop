import { Addresses } from './types.js'

export const addresses: Addresses = {
  '11155111': { // ETH
    chainId: '11155111',
    startBlock: 6899553,
    hubCoreMessenger: '', // dispatcher
    spokeCoreMessenger: '0xA5F325D37E3eDdd79295aD0f8e9cb10f1aC5aE47', // dispatcher
    ethFeeDistributor: '', // empty
    railsGateway: '0xD97fF121D90F24EA6E7A6FA055626132004F9Fe5',
    dispatcher: '0xA5F325D37E3eDdd79295aD0f8e9cb10f1aC5aE47',
    transporter: '0xfFe05A55bd925EB067954de5C43f196e479EdfA6',
    executor: '0xE7a6eE893c800cD23B1e62B6f4E12240103C0f9f',
    tokens: {
      MOCK: '0xbc357f673879a3145172A95546948DBaFd9Fe1cE',
      USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    }
  },
  '11155420': { // OP
    chainId: '11155420',
    startBlock: 1873577,
    spokeCoreMessenger: '0xA5F325D37E3eDdd79295aD0f8e9cb10f1aC5aE47', // dispatcher
    railsGateway: '0xD97fF121D90F24EA6E7A6FA055626132004F9Fe5',
    dispatcher: '0xA5F325D37E3eDdd79295aD0f8e9cb10f1aC5aE47',
    transporter: '0xfFe05A55bd925EB067954de5C43f196e479EdfA6',
    executor: '0xE7a6eE893c800cD23B1e62B6f4E12240103C0f9f',
    tokens: {
      MOCK: '0xbc357f673879a3145172A95546948DBaFd9Fe1cE',
      USDC: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7'
    }
  },
  '84532': { // BASE
    chainId: '84532',
    startBlock: 16752907,
    spokeCoreMessenger: '0xA5F325D37E3eDdd79295aD0f8e9cb10f1aC5aE47', // dispatcher
    railsGateway: '0xD97fF121D90F24EA6E7A6FA055626132004F9Fe5',
    dispatcher: '0xA5F325D37E3eDdd79295aD0f8e9cb10f1aC5aE47',
    transporter: '0xfFe05A55bd925EB067954de5C43f196e479EdfA6',
    executor: '0xE7a6eE893c800cD23B1e62B6f4E12240103C0f9f',
    tokens: {
      MOCK: '0xbc357f673879a3145172A95546948DBaFd9Fe1cE',
      USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    }
  },
  '42069': { // HUB
    chainId: '42069',
    startBlock: 676900,
    spokeCoreMessenger: '0xA5F325D37E3eDdd79295aD0f8e9cb10f1aC5aE47', // dispatcher
    railsGateway: '0xD97fF121D90F24EA6E7A6FA055626132004F9Fe5',
    dispatcher: '0xA5F325D37E3eDdd79295aD0f8e9cb10f1aC5aE47',
    transporter: '0xfFe05A55bd925EB067954de5C43f196e479EdfA6',
    executor: '0xE7a6eE893c800cD23B1e62B6f4E12240103C0f9f',
    tokens: {
      MOCK: '0xbc357f673879a3145172A95546948DBaFd9Fe1cE',
      USDC: '0x36d3f5501Ef2BA0ea329c46C5A4a463C163e1ff0'
    }
  }
}
