import { CCTP } from '#implementations/index.js'

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('CCTP', () => {

  it('Test', async () => {
    const state = CCTP.MessageState.Sent
    expect(state).toBe(CCTP.MessageState.Sent)
  })
})
