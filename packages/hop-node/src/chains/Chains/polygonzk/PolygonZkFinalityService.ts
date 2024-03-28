import { AbstractFinalityService, IFinalityService } from 'src/chains/Services/AbstractFinalityService'

/**
 * As of 20240325, PolygonZK chain has been unstable and unreliable. The chain tends to have
 * finality related bugs that make it impossible to determine correct data.
 * 
 * When the chain stabilizes and their SDK is updated to a stable state, reintroduce this.
 * 
 * Reference: https://twitter.com/0xPolygon/status/1772069585602195586
 */

export class PolygonZkFinalityService extends AbstractFinalityService implements IFinalityService {}
