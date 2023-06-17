import { Chain, Token } from 'src/constants'

/**
 * This data needed to calculate chain balances for a given timestamp. Retrieving this data can take
 * up to an hour to run or may not be possible in the case of missing regenesis data.
 */

type IUnwithdrawnTransfers = {
  [key in Token]: Partial<{
    [key in Chain]: string
  }>
}

type IInFlightL1ToL2Transfers = {
  [key in Token]: Partial<{
    [key in Chain]: string
  }>
}

type IL1TokensSentDirectlyToBridge = {
  [key in Token]: string
}

type IL1InvalidRoot = {
  [key in Token]: string
}

const archiveDataTimestamp: number = 1684998000

// These include Optimism pre-regenesis data
const UnwithdrawnTransfers: IUnwithdrawnTransfers = {
  [Token.USDC]: {
    [Chain.Ethereum]: '11620914510',
    [Chain.Gnosis]: '2367407510',
    [Chain.Polygon]: '6993141',
    [Chain.Optimism]: '608591543',
    [Chain.Arbitrum]: '692121447'
  },
  [Token.USDT]: {
    [Chain.Ethereum]: '284726768',
    [Chain.Gnosis]: '5970088',
    [Chain.Polygon]: '195005308',
    [Chain.Optimism]: '509262863',
    [Chain.Arbitrum]: '889647236'
  },
  [Token.DAI]: {
    [Chain.Ethereum]: '5999029419997878963',
    [Chain.Gnosis]: '999919',
    [Chain.Polygon]: '0',
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '1997714748344663351'
  },
  [Token.ETH]: {
    [Chain.Ethereum]: '41269069749959505879',
    [Chain.Gnosis]: '0',
    [Chain.Polygon]: '9989532547999286',
    [Chain.Optimism]: '368535750741417793',
    [Chain.Arbitrum]: '3316888138646683962',
    [Chain.Nova]: '0'
  },
  [Token.MATIC]: {
    [Chain.Ethereum]: '9999612792838651812',
    [Chain.Gnosis]: '62738218258539121055',
    [Chain.Polygon]: '0'
  },
  [Token.HOP]: {
    [Chain.Ethereum]: '0',
    [Chain.Gnosis]: '0',
    [Chain.Polygon]: '0',
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '0'
  },
  [Token.SNX]: {
    [Chain.Ethereum]: '0',
    [Chain.Optimism]: '0'
  },
  [Token.sUSD]: {
    [Chain.Ethereum]: '0',
    [Chain.Optimism]: '0'
  },
  [Token.rETH]: {
    [Chain.Ethereum]: '0',
    [Chain.Optimism]: '0'
  }
}

// There are no Optimism pre-regenesis values here since all L1 to Optimism pre-regenesis transfers have been relayed
const InFlightL1ToL2Transfers: IInFlightL1ToL2Transfers = {
  [Token.USDC]: {
    [Chain.Gnosis]: '0',
    [Chain.Polygon]: '0',
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '0'
  },
  [Token.USDT]: {
    [Chain.Gnosis]: '0',
    // 0x2bf6c3b315f61c0ba330448866a338a28fb58d9f16d4c530580943b09024527e 2000000
    [Chain.Polygon]: '2000000',
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '0'
  },
  [Token.DAI]: {
    [Chain.Gnosis]: '0',
    [Chain.Polygon]: '0',
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '0'
  },
  [Token.ETH]: {
    [Chain.Gnosis]: '0',
    // 0x94a4b0285ad866a8dd03035585b91daed0df2279cd1957a2d08157e490fecb0c, 1
    [Chain.Polygon]: '1',
    [Chain.Optimism]: '0',
    // 0x29bd9e277ad5a9947de64b37a44677ca7f6ec795d1241589fd5a4a51056feafb, 1000000000000000
    // 0x72d13235de7ca9fba419c8662e14b0bec8fbe712f3a41d04172cf5b511d921ce, 50000000000000000
    [Chain.Arbitrum]: '51000000000000000',
    [Chain.Nova]: '0'
  },
  [Token.MATIC]: {
    [Chain.Gnosis]: '0',
    // 0x0d0812c30bbd1e409917638b0e8439cf0e0f98d66958ac9484f6dc5ea178a716, 1790041515271225938
    [Chain.Polygon]: '1790041515271225938'
  },
  [Token.HOP]: {
    [Chain.Gnosis]: '0',
    [Chain.Polygon]: '0',
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '0'
  },
  [Token.SNX]: {
    [Chain.Optimism]: '0'
  },
  [Token.sUSD]: {
    [Chain.Optimism]: '0'
  },
  [Token.rETH]: {
    [Chain.Optimism]: '0',
    [Chain.Arbitrum]: '0'
  }
}

const L1TokensSentDirectlyToBridge: IL1TokensSentDirectlyToBridge = {
  // 0x7b3aa56febe5c71ed6606988a4e12525cb722f35229828e906b7f7f1ad3a899c, 5000000
  // 0xa7eb6588cc3bef7d21c0bfdf911d32005983547ae30709b6ef968696aed00f68, 52295549
  [Token.USDC]: '57295549',
  [Token.USDT]: '0',
  [Token.DAI]: '0',
  [Token.ETH]: '0',
  [Token.MATIC]: '0',
  [Token.HOP]: '0',
  [Token.SNX]: '0',
  [Token.sUSD]: '0',
  [Token.rETH]: '0'
}

const L1InvalidRoot: IL1InvalidRoot = {
  [Token.USDC]: '10025137464',
  [Token.USDT]: '0',
  [Token.DAI]: '0',
  [Token.ETH]: '38497139540773520376',
  [Token.MATIC]: '0',
  [Token.HOP]: '0',
  [Token.SNX]: '0',
  [Token.sUSD]: '0',
  [Token.rETH]: '0'
}

type IChainBalanceArchiveData = {
  ArchiveDataTimestamp: number
  UnwithdrawnTransfers: IUnwithdrawnTransfers
  InFlightL1ToL2Transfers: IInFlightL1ToL2Transfers
  L1TokensSentDirectlyToBridge: IL1TokensSentDirectlyToBridge
  L1InvalidRoot: IL1InvalidRoot
}

export const ChainBalanceArchiveData: IChainBalanceArchiveData = {
  ArchiveDataTimestamp: archiveDataTimestamp,
  UnwithdrawnTransfers,
  InFlightL1ToL2Transfers,
  L1TokensSentDirectlyToBridge,
  L1InvalidRoot
}
