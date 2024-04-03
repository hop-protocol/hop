import { FinalityStrategy } from '../FinalityStrategy.js'
import { IFinalityStrategy } from '../IFinalityStrategy.js'

/**
 * As of 20240325, PolygonZK chain has been unstable and unreliable. The chain tends to have
 * finality related bugs that make it impossible to determine correct data.
 *
 * We will use probabilistic block numbers for safe until stability is guaranteed.
 *
 * Reference: https://twitter.com/0xPolygon/status/1772069585602195586
 */

export class PolygonZkStrategy extends FinalityStrategy implements IFinalityStrategy {
  override getSafeBlockNumber = async (): Promise<number> => {
    // Somewhat arbitrary, about 25 minutes
    // Approximately 1/2 the time to full finality
    const confirmations = 512
    return this.getProbabilisticBlockNumber(confirmations)
  }
}
