import { IFinalityStrategy } from './strategies/IFinalityStrategy'

export interface IFinalityService extends IFinalityStrategy {
  isCustomBlockNumberImplemented(): boolean
}