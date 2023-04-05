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

  it.skip('should have received message for these deposits', async () => {
    const utils = new LineaUtils()
    const from = '0x20527b2aff565f563da3c27a10e79366b1ee0ad3'

    expect(await utils.getL2MessageDeliveredEvent('0x6567966a1a09fa10b2371c196025b6807c16258e29f9ab27434cfa2b04e02a2d', from)).toBeTruthy()
    expect(await utils.getL2MessageDeliveredEvent('0x04c62655346572b85f655f8e900a0ad0ef82858ba54cb6e3aac26354a5f659fc', from)).toBeTruthy()
    expect(await utils.getL2MessageDeliveredEvent('0xb7c52fac23ea0e11b1cde4162189a3f4daf1c10a3781acdf6957c3efe5248eb8', from)).toBeTruthy()
    expect(await utils.getL2MessageDeliveredEvent('0xf01bf9dca848d76997087452bf7e60f30360efab9fe67c88bff251bef8a8ba1e', from)).toBeTruthy()
    expect(await utils.getL2MessageDeliveredEvent('0x2e4cf560a4e23aa7da34a27521ddf78128b8ec34eecb15ecc3a384dabc777b02', from)).toBeTruthy()
    expect(await utils.getL2MessageDeliveredEvent('0xe2ca479bb6e27c03616d85b99efabf32156f8680284162aae825c82c5311b3ed', from)).toBeTruthy()
    expect(await utils.getL2MessageDeliveredEvent('0x7b2913f2f77c8f97d9071808452a4547e6e38dd9678d67d47e3107af4d926137', from)).toBeTruthy()
    expect(await utils.getL2MessageDeliveredEvent('0x67c4e1dd5df3607d83a652d06425aa9ed184d437b8213309cd777adbfadff3c6', from)).toBeTruthy()
    expect(await utils.getL2MessageDeliveredEvent('0xe44d10b008e39e2344d979e8cebbd5ae9e43a0139577d7bac48fb811e20b25f0', from)).toBeTruthy()
  }, 5 * 60 * 1000)
})
