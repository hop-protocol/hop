import { ArbitrumRelayerFee } from './ArbitrumRelayerFee'
import { BigNumber } from 'ethers'
import { Chain } from '@hop-protocol/sdk-core'
import { IRelayerFee } from './IRelayerFee'
import { LineaRelayerFee } from './LineaRelayerFee'
import { PolygonZkRelayerFee } from './PolygonZkRelayerFee'

type RelayerFeeClass = new (network: string, chain: string, token: string) => IRelayerFee

const RelayerFees: Record<string, RelayerFeeClass> = {
  [Chain.Arbitrum.slug]: ArbitrumRelayerFee,
  [Chain.Nova.slug]: ArbitrumRelayerFee,
  [Chain.Linea.slug]: LineaRelayerFee,
  [Chain.PolygonZk.slug]: PolygonZkRelayerFee
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
