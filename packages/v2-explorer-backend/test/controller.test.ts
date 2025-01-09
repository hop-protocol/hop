import { Controller } from '#controller/index.js'

// note: this requires worker to have indexed events

describe.only('Controller', () => {
  it('should get paginated events', async () => {
    const controller = new Controller()
    const limit = 3
    const eventName = 'MessageSent'
    const result1 = await controller.getEvents({ eventName, limit })
    // console.log(items)
    let timestamps = result1.items.map((item: any) => item.context.blockTimestamp)
    console.log(JSON.stringify(timestamps, null, 2))
    expect(result1.items.length).toBe(limit)
    expect(timestamps).toStrictEqual(timestamps.slice(0).sort((a: any, b: any) => b - a))

    const result2 = await controller.getEvents({ eventName, limit, page: 2 })
    timestamps = result2.items.map((item: any) => item.context.blockTimestamp)
    console.log(JSON.stringify(timestamps, null, 2))
    expect(timestamps).toStrictEqual(timestamps.slice(0).sort((a: any, b: any) => b - a))
    expect(result2.items.length).toBe(limit)

    const result3 = await controller.getEvents({ eventName, limit, page: 3 })
    timestamps = result3.items.map((item: any) => item.context.blockTimestamp)
    console.log(JSON.stringify(timestamps, null, 2))
    expect(timestamps).toStrictEqual(timestamps.slice(0).sort((a: any, b: any) => b - a))
    expect(result3.items.length).toBe(limit)

    const result4 = await controller.getEvents({ eventName, limit, page: 4 })
    timestamps = result4.items.map((item: any) => item.context.blockTimestamp)
    console.log(JSON.stringify(timestamps, null, 2))
    expect(result4.items.length).toBe(limit)
  }, 10 * 60 * 1000)

  it('should get filtered events for MessageSent', async () => {
    const controller = new Controller()
    const eventName = 'MessageSent'

    const randomEvents = await controller.getEvents({ eventName })
    const event = randomEvents.items[0]

    const messageId = event.messageId
    const transactionHash = event.context.transactionHash

    const results1 = await controller.getEvents({ eventName, filter: { messageId } })
    const result1 = results1.items[0]
    expect(result1.messageId).toBe(messageId)
    expect(result1.context.transactionHash).toBe(transactionHash)

    const results2 = await controller.getEvents({ eventName, filter: { transactionHash } })
    const result2 = results2.items[0]
    expect(result2.messageId).toBe(messageId)
    expect(result2.context.transactionHash).toBe(transactionHash)
  })

  it('should get filtered events for MessageBundled', async () => {
    const controller = new Controller()
    const eventName = 'MessageBundled'

    const randomEvents = await controller.getEvents({ eventName })
    const event = randomEvents.items[0]

    const messageId = event.messageId
    const transactionHash = event.context.transactionHash

    const results1 = await controller.getEvents({ eventName, filter: { messageId }})
    const result1 = results1.items[0]
    expect(result1.messageId).toBe(messageId)
    expect(result1.context.transactionHash).toBe(transactionHash)

    const results2 = await controller.getEvents({ eventName, filter: { transactionHash }})
    const result2 = results2.items[0]
    expect(result2.messageId).toBe(messageId)
    expect(result2.context.transactionHash).toBe(transactionHash)
  })
})
