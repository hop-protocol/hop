import { ArbitrumMessageService } from '#chains/Chains/arbitrum/Message.js'
import { MessageDirection } from '#chains/Services/MessageService.js'

describe.skip('getMessage', () => {
  it("should not retry if it can't get L1 to L2 messages", async () => {
    const message = new ArbitrumMessageService()

    const txHash = ''
    const messageType = await message.getMessage(txHash, { messageDirection: MessageDirection.L1_TO_L2, messageIndex: 0 })
    const status = await message.getMessageStatus(messageType)
    expect(status).toBeTruthy()
  }, 10 * 1000)
})
