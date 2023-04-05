import { LineaUtils } from '../../src/utils/LineaUtils'
import { parseUnits } from 'ethers/lib/utils'

describe.skip('LineaUtils', () => {
  it('computeMessageHash', async () => {
    const utils = new LineaUtils()
    const from = '0x20527b2aff565f563da3c27a10e79366b1ee0ad3'
    const messageHash = utils.computeMessageHash({
      from,
      to: '0x20527b2aff565f563da3c27a10e79366b1ee0ad3',
      fee: '0x2386f26fc10000',
      value: parseUnits('0.99', 18),
      deadline: '0x64774e23',
      calldata: '0x'
    })
    console.log('messageHash:', messageHash)
    expect(messageHash).toBe('0x5ae824f9d998efc48fad10caa53de8a4cea4bfb4654bfe07e619fe7a6e3b7d92')
  }, 60 * 1000)

  it('getL1MessageDispatchedEvent', async () => {
    const utils = new LineaUtils()
    const from = '0x20527b2aff565f563da3c27a10e79366b1ee0ad3'
    const l1TxHash = '0x6567966a1a09fa10b2371c196025b6807c16258e29f9ab27434cfa2b04e02a2d'

    const messageDispatchedEvent = await utils.getL1MessageDispatchedEvent(l1TxHash, from)
    console.log('messageDispatchedEvent:', messageDispatchedEvent)
    expect(messageDispatchedEvent).toBeTruthy()
  }, 60 * 1000)

  it('getL2MessageDeliveredEvent', async () => {
    const utils = new LineaUtils()
    const from = '0x20527b2aff565f563da3c27a10e79366b1ee0ad3'
    const l1TxHash = '0x6567966a1a09fa10b2371c196025b6807c16258e29f9ab27434cfa2b04e02a2d'

    const messageDeliveredEvent = await utils.getL2MessageDeliveredEvent(l1TxHash, from)
    console.log('messageDeliveredEvent:', messageDeliveredEvent)
    expect(messageDeliveredEvent).toBeTruthy()
  }, 60 * 1000)

  it('getL1MessageConfirmedEvent', async () => {
    const utils = new LineaUtils()
    const from = '0x20527b2aff565f563da3c27a10e79366b1ee0ad3'
    const l1TxHash = '0x6567966a1a09fa10b2371c196025b6807c16258e29f9ab27434cfa2b04e02a2d'

    const messageConfirmedEvent = await utils.getL1MessageConfirmedEvent(l1TxHash, from)
    console.log('messageConfirmedEvent:', messageConfirmedEvent)
    expect(messageConfirmedEvent).toBeTruthy()
  }, 60 * 1000)
})
