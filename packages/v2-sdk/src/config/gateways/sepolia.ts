import type { GatewayConfig } from './types.js'

export const gateways: Record<string, GatewayConfig> = {
  '11155111': { // Seploia
    chainId: '11155111',
    startBlock: 7897346,
    transporter: '0x08cD9b2afcE41F93Cfe89338De090e582f25cadf',
    dispatcher: '0xe4e95dc6ead1F78E2302812D6aE1994Fd4De407d',
    executor: '0x32F1f3Fc0fB907791dC5c15EF8111808231cA608',
    railsGateway: '0x638BE68765dE7eb4574eb60B4AF79D7AD75edcdF',
    stakingRegistry: '0x48013162D54DF91Fa0916D107366FE9D0D2b1D39',
    hopToken: '0x236F2dD02A8dd1DbdC62C648cCE0F3615278beab',
    railsPathImplementation: '0x26D54d7743deaEFdad6f3F60CaA62c434DB5523E'
  },
  '11155420': { // Optimism Seploia
    chainId: '11155420',
    startBlock: 25056143,
    transporter: '0x08cD9b2afcE41F93Cfe89338De090e582f25cadf',
    dispatcher: '0xe4e95dc6ead1F78E2302812D6aE1994Fd4De407d',
    executor: '0x32F1f3Fc0fB907791dC5c15EF8111808231cA608',
    railsGateway: '0x638BE68765dE7eb4574eb60B4AF79D7AD75edcdF',
    stakingRegistry: '0x48013162D54DF91Fa0916D107366FE9D0D2b1D39',
    hopToken: '0x236F2dD02A8dd1DbdC62C648cCE0F3615278beab',
    railsPathImplementation: '0x26D54d7743deaEFdad6f3F60CaA62c434DB5523E'
  },
  '84532': { // Base Seploia
    chainId: '84532',
    startBlock: 23073292,
    transporter: '0x08cD9b2afcE41F93Cfe89338De090e582f25cadf',
    dispatcher: '0xe4e95dc6ead1F78E2302812D6aE1994Fd4De407d',
    executor: '0x32F1f3Fc0fB907791dC5c15EF8111808231cA608',
    railsGateway: '0x638BE68765dE7eb4574eb60B4AF79D7AD75edcdF',
    stakingRegistry: '0x48013162D54DF91Fa0916D107366FE9D0D2b1D39',
    hopToken: '0x236F2dD02A8dd1DbdC62C648cCE0F3615278beab',
    railsPathImplementation: '0x26D54d7743deaEFdad6f3F60CaA62c434DB5523E'
  }
}
