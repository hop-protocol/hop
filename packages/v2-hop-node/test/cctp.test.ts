import { MessageState } from '#cctp/types.js'

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('CCTP', () => {

  it('Test', async () => {
    const state = MessageState.Sent
    expect(state).toBe(MessageState.Sent)
  })
})
