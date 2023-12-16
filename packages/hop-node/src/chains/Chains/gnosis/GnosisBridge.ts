import { Chain } from 'src/constants'
import { ChainBridgeParams } from 'src/chains/AbstractChainBridge'
import { GnosisMessageService } from 'src/chains/Chains/gnosis/GnosisMessageService'

export const GnosisBridgeParams: ChainBridgeParams = {
  chainSlug: Chain.Gnosis,
  Message: GnosisMessageService
}
