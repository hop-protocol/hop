import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/ChainBridge'
import { GnosisMessageService } from 'src/chains/Chains/gnosis/GnosisMessageService'

export const GnosisBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.Gnosis,
  chainServices: {
    MessageService: GnosisMessageService
  }
}
