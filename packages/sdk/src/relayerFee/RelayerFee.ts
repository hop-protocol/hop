import { ArbitrumRelayerFee } from './ArbitrumRelayerFee.js'
import { BigNumber } from 'ethers'
import { ChainSlug } from '#chains/index.js'
import { IRelayerFee } from './IRelayerFee.js'
import { LineaRelayerFee } from './LineaRelayerFee.js'
import { PolygonZkRelayerFee } from './PolygonZkRelayerFee.js'

type RelayerFeeClass = new (network: string, chain: string, token: string) => IRelayerFee

const RelayerFees: Record<string, RelayerFeeClass> = {
  [ChainSlug.Arbitrum]: ArbitrumRelayerFee,
  [ChainSlug.Nova]: ArbitrumRelayerFee,
  [ChainSlug.Linea]: LineaRelayerFee,
  [ChainSlug.PolygonZk]: PolygonZkRelayerFee
}

export class RelayerFee {
  /**
   * @returns {BigNumber} The cost of in Wei
   */
  static getRelayCost = async (network: string, chain: string, token: string): Promise<BigNumber> => {
    const RelayerFeeConstructor: RelayerFeeClass | undefined = RelayerFees?.[chain]
    if (!RelayerFeeConstructor) {
      throw new Error(`Relayer fee not implemented for network ${network}, chain ${chain}, token ${token}`)
    }
    const relayerFee = new RelayerFeeConstructor(network, chain, token)
    return relayerFee.getRelayCost()
  }
}
