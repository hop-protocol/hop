import { Chain } from 'src/constants'
import { GnosisMessageService } from './Message'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const GnosisBridge = createChainBridgeClass(
  Chain.Gnosis,
  GnosisMessageService
)
