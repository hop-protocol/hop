const ARBITRUM_MESSENGER = '0xE681857DEfE8b454244e701BA63EfAa078d7eA85'
const ARBITRUM_DEFAULT_VALUES = {
  arbChain: '0x175C0b09453cBb44fb7F56BA5638c43427Aa6a85',
  l2BridgeAddress: '0x169c644d4A08CFEFaaE894ca51f079b51e57EA42',
  defaultGasLimit: 1000000,
  defaultGasPrice: 0,
  defaultCallValue: 0,
  defaultSubMessageType: '0x01'
}


const OPTIMISM_MESSENGER = '0xaaa'
const OPTIMISM_DEFAULT_VALUES = {
  l2BridgeAddress: '0xbbb',
  defaultGasLimit: 1000000
}

export const L2_CHAIN_DATA = {
  ARBITRUM: {
    name: 'arbitrum',
    defaultValues: ARBITRUM_DEFAULT_VALUES,
    messenger: ARBITRUM_MESSENGER
  },
  OPTIMISM: {
    name: 'optimism',
    defaultValues: OPTIMISM_DEFAULT_VALUES,
    messenger: OPTIMISM_MESSENGER
  }
}
