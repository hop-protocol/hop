import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/ChainBridge'
import { LineaMessageService } from 'src/chains/Chains/linea/LineaMessageService'

export const LineaBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.Linea,
  chainServices: {
    MessageService: LineaMessageService
  }
}
