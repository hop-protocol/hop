import { AbstractChainBridge } from '../../AbstractChainBridge'
import { Chain } from 'src/constants'
import { IChainBridge } from '../../IChainBridge'
import { ZkSyncMessageService } from './Message'

export class ZkSyncBridge extends AbstractChainBridge implements IChainBridge {
  chainSlug = Chain.ScrollZk
  message = new ZkSyncMessageService()
}
