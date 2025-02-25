import { Addresses } from './types.js'

export const addresses: Addresses = {
  '11155111': { // Ethereum
    chainId: '11155111',
    startBlock: 7784611,
    hubCoreMessenger: '0x0C2Dd2a7E353ae2cCB27B66b54475cdCf26269DA', // dispatcher
    spokeCoreMessenger: '0x0C2Dd2a7E353ae2cCB27B66b54475cdCf26269DA', // dispatcher
    ethFeeDistributor: '', // empty
    railsGateway: '0xb45884c7B86b588FBeb3d2fdF2AC6Ce03B1779B6',
    dispatcher: '0x0C2Dd2a7E353ae2cCB27B66b54475cdCf26269DA',
    transporter: '0x0845c6F5A205A8e43Ed840febD07E98c0dFD7847',
    executor: '0xc07e0A6fbCC4A6C33678BCEa52C76d6BEb42c0Fa',
    stakingRegistry: '0x560E9d609b48a9793Fb75806c103919eAaFc617d',
    hopToken: '0xa8cDA973a218322c14B95961a7eE0Ac547672787',
    tokens: {
      MOCK: '0x8be4de23709517Ca2fC138Da0959794db5A8746A',
      USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    }
  },
  '11155420': { // Optimism
    chainId: '11155420',
    startBlock: 24354188,
    spokeCoreMessenger: '0x0C2Dd2a7E353ae2cCB27B66b54475cdCf26269DA', // dispatcher
    railsGateway: '0xb45884c7B86b588FBeb3d2fdF2AC6Ce03B1779B6',
    dispatcher: '0x0C2Dd2a7E353ae2cCB27B66b54475cdCf26269DA',
    transporter: '0x0845c6F5A205A8e43Ed840febD07E98c0dFD7847',
    executor: '0xc07e0A6fbCC4A6C33678BCEa52C76d6BEb42c0Fa',
    stakingRegistry: '0x560E9d609b48a9793Fb75806c103919eAaFc617d',
    hopToken: '0xFAcAD5f3210A078fE429dc4d51C852B22F6DA430',
    tokens: {
      MOCK: '0x8be4de23709517Ca2fC138Da0959794db5A8746A',
      USDC: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7'
    }
  },
  '84532': { // Base
    chainId: '84532',
    startBlock: 22371334,
    spokeCoreMessenger: '0x0C2Dd2a7E353ae2cCB27B66b54475cdCf26269DA', // dispatcher
    railsGateway: '0xb45884c7B86b588FBeb3d2fdF2AC6Ce03B1779B6',
    dispatcher: '0x0C2Dd2a7E353ae2cCB27B66b54475cdCf26269DA',
    transporter: '0x0845c6F5A205A8e43Ed840febD07E98c0dFD7847',
    executor: '0xc07e0A6fbCC4A6C33678BCEa52C76d6BEb42c0Fa',
    stakingRegistry: '0x560E9d609b48a9793Fb75806c103919eAaFc617d',
    hopToken: '0x25593d5474978cd1d5F159dE28113FaE6C6929C7',
    tokens: {
      MOCK: '0x8be4de23709517Ca2fC138Da0959794db5A8746A',
      USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    }
  },
  '42069': { // Hub Chain
    chainId: '42069',
    startBlock: 6295536,
    spokeCoreMessenger: '0x0C2Dd2a7E353ae2cCB27B66b54475cdCf26269DA', // dispatcher
    railsGateway: '0xb45884c7B86b588FBeb3d2fdF2AC6Ce03B1779B6',
    dispatcher: '0x0C2Dd2a7E353ae2cCB27B66b54475cdCf26269DA',
    transporter: '0x0845c6F5A205A8e43Ed840febD07E98c0dFD7847',
    executor: '0xc07e0A6fbCC4A6C33678BCEa52C76d6BEb42c0Fa',
    stakingRegistry: '0x560E9d609b48a9793Fb75806c103919eAaFc617d',
    hopToken: '0xFAcAD5f3210A078fE429dc4d51C852B22F6DA430',
    tokens: {
      MOCK: '0x8be4de23709517Ca2fC138Da0959794db5A8746A',
      USDC: '0x36d3f5501Ef2BA0ea329c46C5A4a463C163e1ff0'
    }
  }
}
