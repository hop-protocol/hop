import { IFinalityStrategy } from './strategies/IFinalityStrategy.js'

export interface IFinalityService extends IFinalityStrategy {
  isCustomBlockNumberImplemented(): boolean
}
