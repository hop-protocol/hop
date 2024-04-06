import { Controller } from '../src/controller'

// note: this requires worker to have indexed events

describe('Controller', () => {
  it('should get paginated events', async () => {
    const controller = new Controller()
    const limit = 5
    const eventName = 'MessageSent'
    const result1 = await controller.getEvents(eventName, limit)
    // console.log(items)
    let timestamps = result1.items.map((item: any) => item.context.blockTimestamp)
    console.log(JSON.stringify(timestamps, null, 2))
    expect(result1.firstKey).toBe(null)
    expect(result1.lastKey).toBeTruthy()
    expect(result1.items.length).toBe(limit)
    expect(timestamps).toStrictEqual(timestamps.slice(0).sort((a: any, b: any) => b - a))

    const result2 = await controller.getEvents(eventName, limit, result1.lastKey)
    timestamps = result2.items.map((item: any) => item.context.blockTimestamp)
    console.log(JSON.stringify(timestamps, null, 2))
    expect(result2.firstKey).toBeTruthy()
    expect(result2.lastKey).toBeTruthy()
    expect(timestamps).toStrictEqual(timestamps.slice(0).sort((a: any, b: any) => b - a))
    expect(result2.items.length).toBe(limit)

    const result3 = await controller.getEvents(eventName, limit, result2.lastKey)
    timestamps = result3.items.map((item: any) => item.context.blockTimestamp)
    console.log(JSON.stringify(timestamps, null, 2))
    expect(result3.firstKey).toBeTruthy()
    expect(result3.lastKey).toBeTruthy()
    expect(timestamps).toStrictEqual(timestamps.slice(0).sort((a: any, b: any) => b - a))
    expect(result3.items.length).toBe(limit)

    const result4 = await controller.getEvents(eventName, limit, null, result3.firstKey)
    timestamps = result4.items.map((item: any) => item.context.blockTimestamp)
    console.log(JSON.stringify(timestamps, null, 2))
    expect(result4.firstKey).toBeTruthy()
    expect(result4.lastKey).toBeTruthy()
    expect(result4.items.length).toBe(limit)
    expect(result2.lastKey).toBe(result4.lastKey)
  }, 10 * 60 * 1000)

  it('should get filtered events for MessageSent', async () => {
    const controller = new Controller()
    const eventName = 'MessageSent'
    const messageId = '0x562ba81beb1d09afddfa1330d9628ba1dee69d2f9cba0ffd33e9fb5258ba7b8b'
    const transactionHash = '0x8fbe45595cd217261bb8335492c8edd3f4ef02f461003914213e64ee50d430a5'
    const result1 = await controller.getFilteredEvents(eventName, {
      messageId
    })
    expect(result1.messageId).toBe(messageId)
    expect(result1.context.transactionHash).toBe(transactionHash)

    const result2 = await controller.getFilteredEvents(eventName, {
      transactionHash
    })
    expect(result2.messageId).toBe(messageId)
    expect(result2.context.transactionHash).toBe(transactionHash)
  })

  it('should get filtered events for MessageBundled', async () => {
    const controller = new Controller()
    const eventName = 'MessageBundled'
    const messageId = '0x562ba81beb1d09afddfa1330d9628ba1dee69d2f9cba0ffd33e9fb5258ba7b8b'
    const transactionHash = '0x8fbe45595cd217261bb8335492c8edd3f4ef02f461003914213e64ee50d430a5'
    const result1 = await controller.getFilteredEvents(eventName, {
      messageId
    })
    expect(result1.messageId).toBe(messageId)
    expect(result1.context.transactionHash).toBe(transactionHash)

    const result2 = await controller.getFilteredEvents(eventName, {
      transactionHash
    })
    expect(result2.messageId).toBe(messageId)
    expect(result2.context.transactionHash).toBe(transactionHash)
  })
})
