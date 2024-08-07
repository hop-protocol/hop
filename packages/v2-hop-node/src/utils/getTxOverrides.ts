import type { TxOverrides } from '#types/index.js'
import { SignerConfig } from '#config/index.js'
import { ChainSlug, NetworkSlug } from '@hop-protocol/sdk'
import { MIN_GNOSIS_GAS_PRICE, MIN_POLYGON_GAS_PRICE } from '#constants/index.js'
import { BigNumber } from 'ethers'
import { getRpcProvider } from './getRpcProvider.js'


/**
 * @dev Not all chains require custom tx overrides. If no overrides are required,
 * an empty object is returned.
 */

export async function getTxOverrides (chainSlug: string): Promise<TxOverrides> {
  const network: NetworkSlug = SignerConfig.network

  switch (chainSlug) {
    case ChainSlug.Polygon:
      return getPolygonTxOverrides()
    case ChainSlug.Gnosis:
      return getGnosisTxOverrides()
    case ChainSlug.Linea:
      return getLineaTxOverrides(network)
    default:
      return {}
  }
}

async function getPolygonTxOverrides (): Promise<TxOverrides> {
  // Not all Polygon nodes follow recommended 30 Gwei gasPrice
  // https://forum.matic.network/t/recommended-min-gas-price-setting/2531
  const provider = getRpcProvider(ChainSlug.Polygon)
  const minGasPrice = BigNumber.from(MIN_POLYGON_GAS_PRICE)

  // Add an arbitrary multiplier to guarantee quick execution. Since the cost
  // of gas on Polygon is so cheap, using a multiplier this large should be fine.
  const multiplier = 2
  let gasPrice: BigNumber = (await provider.getGasPrice()).mul(multiplier)
  if (gasPrice.lt(minGasPrice)) {
    gasPrice = minGasPrice
  }

  return {
    gasPrice
  }
}

async function getGnosisTxOverrides (): Promise<TxOverrides> {
  const provider = getRpcProvider(ChainSlug.Gnosis)
  const minGasPrice = BigNumber.from(MIN_GNOSIS_GAS_PRICE)

  // Add an arbitrary multiplier to guarantee quick execution. Since the cost
  // of gas on Gnosis is so cheap, using a multiplier this large should be fine.
  // Gas estimation on Gnosis without the multiplier sometimes results in
  // the error "code:-32010, message: FeeTooLowToCompete"
  const multiplier = 3
  let gasPrice: BigNumber = (await provider.getGasPrice()).mul(multiplier)
  if (gasPrice.lt(minGasPrice)) {
    gasPrice = minGasPrice
  }

  return {
    gasPrice
  }
}

async function getLineaTxOverrides (network: NetworkSlug): Promise<TxOverrides> {
  // There are no overrides required for Linea mainnet
  if (network === NetworkSlug.Mainnet) return {}

  // Linea testnet gas estimation is not reliable, so we hardcode a gas limit
  // that is high enough to cover all transactions within the system.
  const gasLimit = 10_000_000
  return {
    gasLimit
  }
}
