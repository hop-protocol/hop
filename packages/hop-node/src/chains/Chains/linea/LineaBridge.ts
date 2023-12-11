import { Chain } from 'src/constants'
import { LineaMessageService } from 'src/chains/Chains/linea/Message'
import { createChainBridgeClass } from 'src/chains/Factories/ChainBridgeFactory'

export const LineaBridge = createChainBridgeClass(
  Chain.Gnosis,
  LineaMessageService
)
