import { ChainSlug, TokenSymbol } from '@hop-protocol/sdk'

/**
 * This data needed to calculate chain balances for a given timestamp. Retrieving this data can take
 * up to an hour to run or may not be possible in the case of missing regenesis data.
 */

type IUnwithdrawnTransfers = Partial<{
  [key in TokenSymbol]: Partial<{
    [key in ChainSlug]: string
  }>
}>

type IInFlightL1ToL2Transfers = Partial<{
  [key in TokenSymbol]: Partial<{
    [key in ChainSlug]: string
  }>
}>

type IL1TokensSentDirectlyToBridge = Partial<{
  [key in TokenSymbol]: string
}>

type IL1InvalidRoot = Partial<{
  [key in TokenSymbol]: string
}>

const archiveDataTimestamp: number = 1684998000

// These include Optimism pre-regenesis data
const UnwithdrawnTransfers: IUnwithdrawnTransfers = {
  [TokenSymbol.USDC]: {
    [ChainSlug.Ethereum]: '11620914510',
    [ChainSlug.Gnosis]: '2367407510',
    [ChainSlug.Polygon]: '6993141',
    [ChainSlug.Optimism]: '608591543',
    [ChainSlug.Arbitrum]: '692121447',
    [ChainSlug.Base]: '0'
  },
  [TokenSymbol.USDT]: {
    [ChainSlug.Ethereum]: '284726768',
    [ChainSlug.Gnosis]: '5970088',
    [ChainSlug.Polygon]: '195005308',
    [ChainSlug.Optimism]: '509262863',
    [ChainSlug.Arbitrum]: '889647236'
  },
  [TokenSymbol.DAI]: {
    [ChainSlug.Ethereum]: '5999029419997878963',
    [ChainSlug.Gnosis]: '999919',
    [ChainSlug.Polygon]: '0',
    [ChainSlug.Optimism]: '0',
    [ChainSlug.Arbitrum]: '1997714748344663351'
  },
  [TokenSymbol.ETH]: {
    [ChainSlug.Ethereum]: '41269069749959505879',
    [ChainSlug.Gnosis]: '0',
    [ChainSlug.Polygon]: '9989532547999286',
    [ChainSlug.Optimism]: '368535750741417793',
    [ChainSlug.Arbitrum]: '3316888138646683962',
    [ChainSlug.Nova]: '0',
    [ChainSlug.Base]: '0'
  },
  [TokenSymbol.MATIC]: {
    [ChainSlug.Ethereum]: '9999612792838651812',
    [ChainSlug.Gnosis]: '62738218258539121055',
    [ChainSlug.Polygon]: '0'
  },
  [TokenSymbol.HOP]: {
    [ChainSlug.Ethereum]: '0',
    [ChainSlug.Gnosis]: '0',
    [ChainSlug.Polygon]: '0',
    [ChainSlug.Optimism]: '0',
    [ChainSlug.Arbitrum]: '0',
    [ChainSlug.Nova]: '0',
    [ChainSlug.Base]: '0'
  },
  [TokenSymbol.SNX]: {
    [ChainSlug.Ethereum]: '0',
    [ChainSlug.Optimism]: '0'
  },
  [TokenSymbol.sUSD]: {
    [ChainSlug.Ethereum]: '0',
    [ChainSlug.Optimism]: '0'
  },
  [TokenSymbol.rETH]: {
    [ChainSlug.Ethereum]: '0',
    [ChainSlug.Optimism]: '0',
    [ChainSlug.Arbitrum]: '0'
  },
  [TokenSymbol.MAGIC]: {
    [ChainSlug.Ethereum]: '0',
    [ChainSlug.Arbitrum]: '0',
    [ChainSlug.Nova]: '0'
  }
}

// There are no Optimism pre-regenesis values here since all L1 to Optimism pre-regenesis transfers have been relayed
const InFlightL1ToL2Transfers: IInFlightL1ToL2Transfers = {
  [TokenSymbol.USDC]: {
    [ChainSlug.Gnosis]: '0',
    [ChainSlug.Polygon]: '0',
    [ChainSlug.Optimism]: '0',
    [ChainSlug.Arbitrum]: '0',
    [ChainSlug.Base]: '0'
  },
  [TokenSymbol.USDT]: {
    [ChainSlug.Gnosis]: '0',
    // 0x2bf6c3b315f61c0ba330448866a338a28fb58d9f16d4c530580943b09024527e 2000000
    [ChainSlug.Polygon]: '2000000',
    [ChainSlug.Optimism]: '0',
    [ChainSlug.Arbitrum]: '0'
  },
  [TokenSymbol.DAI]: {
    [ChainSlug.Gnosis]: '0',
    [ChainSlug.Polygon]: '0',
    [ChainSlug.Optimism]: '0',
    [ChainSlug.Arbitrum]: '0'
  },
  [TokenSymbol.ETH]: {
    [ChainSlug.Gnosis]: '0',
    // 0x94a4b0285ad866a8dd03035585b91daed0df2279cd1957a2d08157e490fecb0c, 1
    [ChainSlug.Polygon]: '1',
    [ChainSlug.Optimism]: '0',
    // 0x29bd9e277ad5a9947de64b37a44677ca7f6ec795d1241589fd5a4a51056feafb, 1000000000000000
    // 0x72d13235de7ca9fba419c8662e14b0bec8fbe712f3a41d04172cf5b511d921ce, 50000000000000000
    [ChainSlug.Arbitrum]: '51000000000000000',
    [ChainSlug.Nova]: '0',
    [ChainSlug.Base]: '0'
  },
  [TokenSymbol.MATIC]: {
    [ChainSlug.Gnosis]: '0',
    // 0x0d0812c30bbd1e409917638b0e8439cf0e0f98d66958ac9484f6dc5ea178a716, 1790041515271225938
    [ChainSlug.Polygon]: '1790041515271225938'
  },
  [TokenSymbol.HOP]: {
    [ChainSlug.Gnosis]: '0',
    [ChainSlug.Polygon]: '0',
    [ChainSlug.Optimism]: '0',
    [ChainSlug.Arbitrum]: '0',
    [ChainSlug.Nova]: '0',
    [ChainSlug.Base]: '0'
  },
  [TokenSymbol.SNX]: {
    [ChainSlug.Optimism]: '0'
  },
  [TokenSymbol.sUSD]: {
    [ChainSlug.Optimism]: '0'
  },
  [TokenSymbol.rETH]: {
    [ChainSlug.Optimism]: '0',
    [ChainSlug.Arbitrum]: '0'
  },
  [TokenSymbol.MAGIC]: {
    [ChainSlug.Arbitrum]: '0',
    [ChainSlug.Nova]: '0'
  }
}

const L1TokensSentDirectlyToBridge: IL1TokensSentDirectlyToBridge = {
  // 0x7b3aa56febe5c71ed6606988a4e12525cb722f35229828e906b7f7f1ad3a899c, 5000000
  // 0xa7eb6588cc3bef7d21c0bfdf911d32005983547ae30709b6ef968696aed00f68, 52295549
  [TokenSymbol.USDC]: '57295549',
  [TokenSymbol.USDT]: '0',
  [TokenSymbol.DAI]: '0',
  [TokenSymbol.ETH]: '0',
  [TokenSymbol.MATIC]: '0',
  [TokenSymbol.HOP]: '0',
  [TokenSymbol.SNX]: '0',
  [TokenSymbol.sUSD]: '0',
  [TokenSymbol.rETH]: '0',
  [TokenSymbol.MAGIC]: '0'
}

const L1InvalidRoot: IL1InvalidRoot = {
  [TokenSymbol.USDC]: '10025137464',
  [TokenSymbol.USDT]: '0',
  [TokenSymbol.DAI]: '0',
  [TokenSymbol.ETH]: '38497139540773520376',
  [TokenSymbol.MATIC]: '0',
  [TokenSymbol.HOP]: '0',
  [TokenSymbol.SNX]: '0',
  [TokenSymbol.sUSD]: '0',
  [TokenSymbol.rETH]: '0',
  [TokenSymbol.MAGIC]: '0'
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
