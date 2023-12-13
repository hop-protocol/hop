import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/AbstractChainBridge'
import { LineaMessageService } from 'src/chains/Chains/linea/LineaMessageService'

export const LineaBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.Linea,
  Message: LineaMessageService
}
