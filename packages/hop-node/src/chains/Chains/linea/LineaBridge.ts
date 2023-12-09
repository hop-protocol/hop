import { Chain } from 'src/constants'
import { LineaMessageService } from './Message'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const LineaBridge = createChainBridgeClass(
  Chain.Gnosis,
  LineaMessageService
)
