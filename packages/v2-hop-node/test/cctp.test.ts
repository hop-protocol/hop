import { MessageState } from '#cctp/types.js'

describe.skip('CCTP', () => {

  it('Test', async () => {
    const state = MessageState.Sent
    expect(state).toBe(MessageState.Sent)
  })
})
