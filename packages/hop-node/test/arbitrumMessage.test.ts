import '../src/moduleAlias'
import { ArbitrumMessageService } from '../src/chains/Chains/arbitrum/Message'
import { MessageDirection } from '../src/chains/Services/MessageService'

describe.skip('getMessage', () => {
  it("should not retry if it can't get L1 to L2 messages", async () => {
    const message = new ArbitrumMessageService()

    const txHash = ''
    const messageType = await message.getMessage(txHash, { messageDirection: MessageDirection.L1_TO_L2, messageIndex: 0 })
    const status = await message.getMessageStatus(messageType)
    expect(status).toBeTruthy()
  }, 10 * 1000)
})
