import { ArbitrumRelayerFee } from './ArbitrumRelayerFee'
import { BigNumber } from 'ethers'
import { models } from '@hop-protocol/sdk-core'
import { IRelayerFee } from './IRelayerFee'
import { LineaRelayerFee } from './LineaRelayerFee'
import { PolygonZkRelayerFee } from './PolygonZkRelayerFee'

type RelayerFeeClass = new (network: string, chain: string, token: string) => IRelayerFee

const RelayerFees: Record<string, RelayerFeeClass> = {
  [models.Chain.Arbitrum.slug]: ArbitrumRelayerFee,
  [models.Chain.Nova.slug]: ArbitrumRelayerFee,
  [models.Chain.Linea.slug]: LineaRelayerFee,
  [models.Chain.PolygonZk.slug]: PolygonZkRelayerFee
}

class RelayerFee {
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

export default RelayerFee
