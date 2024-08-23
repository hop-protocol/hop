import pgp from 'pg-promise'
import { BundleForwardedTable } from '#pgDb/events/messenger/BundleForwarded.js'
import { BundleReceivedTable } from '#pgDb/events/messenger/BundleReceived.js'
import { BundleSetTable } from '#pgDb/events/messenger/BundleSet.js'
import { FeesSentToHubTable } from '#pgDb/events/messenger/FeesSentToHub.js'
import { MessageBundledTable } from '#pgDb/events/messenger/MessageBundled.js'
import { MessageExecutedTable } from '#pgDb/events/messenger/MessageExecuted.js'
import { MessageSentTable } from '#pgDb/events/messenger/MessageSent.js'
import { BundleCommittedTable } from '#pgDb/events/messenger/BundleCommitted.js'
import { TransferBondedTable } from '#pgDb/events/railsGateway/TransferBonded.js'
import { TransferSentTable } from '#pgDb/events/railsGateway/TransferSent.js'
import { postgresConfig } from '#config/index.js'
import { generateMockBundleCommitted, generateMockEventContext, generateRandomInt, generateMockTransferSent, generateMockTransferBonded, generateRandomAddress, generateRandomUint256, generateMockBundleForwarded, generateMockBundleReceived, generateMockBundleSet, generateMockFeesSentToHub, generateMockMessageBundled, generateMockMessageExecuted, generateMockMessageSent, generateRandomBytes32 } from '#utils/mockDataGenerator.js'
import stringify from 'json-stable-stringify'

// Helper function to recursively sort arrays of objects
function sortNestedArrays(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortNestedArrays).sort((a, b) => {
      if (typeof a === 'object' && typeof b === 'object') {
        return JSON.stringify(a).localeCompare(JSON.stringify(b))
      }
      return 0
    })
  } else if (obj !== null && typeof obj === 'object') {
    const sortedObj: Record<string, any> = {}
    Object.keys(obj).sort().forEach(key => {
      sortedObj[key] = sortNestedArrays(obj[key])
    })
    return sortedObj
  }
  return obj
}

// Generalized function to stringify objects deterministically
function deterministicStringify(obj: any): string {
  const sortedObj = sortNestedArrays(obj)
  return stringify(sortedObj)
}

describe.only('Db', () => {
  const db = pgp({})({ ...postgresConfig })

  describe('Messenger', () => {
    describe('BundleCommittedTable', () => {
      it('should put, get, and update data', async () => {
        const table = new BundleCommittedTable(db)
        const event = generateMockBundleCommitted()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)
        expect(true).toBeTruthy()

        const items = await table.getItems({ filter: { bundleId: data.bundleId }})
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

        const updatedData = Object.assign({}, data, {
          toChainId: generateRandomInt().toString()
        })

        await table.upsertItem(updatedData)

        const newItems = await table.getItems({ filter: { bundleId: data.bundleId }})
        expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
      }, 60 * 1000)
    })
    describe('BundleForwardedTable', () => {
      it('should put, get, and update data', async () => {
        console.log('yoo')
        const table = new BundleForwardedTable(db)
        const event = generateMockBundleForwarded()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)
        expect(true).toBeTruthy()

        const items = await table.getItems({ filter: { bundleId: data.bundleId }})
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

        const updatedData = Object.assign({}, data, {
          bundleRoot: generateRandomBytes32()
        })

        await table.upsertItem(updatedData)

        const newItems = await table.getItems({ filter: { bundleId: data.bundleId }})
        expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
      }, 60 * 1000)
    })
    describe('BundleReceivedTable', () => {
      it('should put, get, and update data', async () => {
        const table = new BundleReceivedTable(db)
        const event = generateMockBundleReceived()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)
        expect(true).toBeTruthy()

        const items = await table.getItems({ filter: { bundleId: data.bundleId }})
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

        const updatedData = Object.assign({}, data, {
          bundleRoot: generateRandomBytes32()
        })

        await table.upsertItem(updatedData)

        const newItems = await table.getItems({ filter: { bundleId: data.bundleId }})
        expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
      }, 60 * 1000)
    })
    describe('BundleSetTable', () => {
      it('should put, get, and update data', async () => {
        const table = new BundleSetTable(db)
        const event = generateMockBundleSet()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)
        expect(true).toBeTruthy()

        const items = await table.getItems({ filter: { bundleId: data.bundleId }})
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

        const updatedData = Object.assign({}, data, {
          bundleRoot: generateRandomBytes32()
        })

        await table.upsertItem(updatedData)

        const newItems = await table.getItems({ filter: { bundleId: data.bundleId }})
        expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
      }, 60 * 1000)
    })
    describe.skip('FeesSentToHub', () => {
      it('should put, get, and update data', async () => {
        const table = new FeesSentToHubTable(db)
        const event = generateMockFeesSentToHub()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)
        expect(true).toBeTruthy()

        const items = await table.getItems()
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))
      }, 60 * 1000)
    })
    describe('MessageBundledTable', () => {
      it('should put, get, and update data', async () => {
        const table = new MessageBundledTable(db)
        const event = generateMockMessageBundled()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)
        expect(true).toBeTruthy()

        const items = await table.getItems({ filter: { messageId: data.messageId }})
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

        const updatedData = Object.assign({}, data, {
          bundleId: generateRandomBytes32()
        })

        await table.upsertItem(updatedData)

        const newItems = await table.getItems({ filter: { messageId: data.messageId }})
        expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
      }, 60 * 1000)
    })
    describe('MessageExecutedTable', () => {
      it('should put, get, and update data', async () => {
        const table = new MessageExecutedTable(db)
        const event = generateMockMessageExecuted()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)
        expect(true).toBeTruthy()

        const items = await table.getItems({ filter: { messageId: data.messageId }})
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

        const updatedData = Object.assign({}, data, {
          fromChainId: generateRandomInt().toString()
        })

        await table.upsertItem(updatedData)

        const newItems = await table.getItems({ filter: { messageId: data.messageId }})
        expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
      }, 60 * 1000)
    })
    describe('MessageSentTable', () => {
      it('should put, get, and update data', async () => {
        const table = new MessageSentTable(db)
        const event = generateMockMessageSent()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)
        expect(true).toBeTruthy()

        const items = await table.getItems({ filter: { messageId: data.messageId }})
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

        const updatedData = Object.assign({}, data, {
          toChainId: generateRandomInt().toString()
        })

        await table.upsertItem(updatedData)

        const newItems = await table.getItems({ filter: { messageId: data.messageId }})
        expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
      }, 60 * 1000)
    })
    describe('TransferSentTable', () => {
      it('should put, get, and update data', async () => {
        const db = pgp({})({ ...postgresConfig })
        const table = new TransferSentTable(db)

        const event = generateMockTransferSent()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)
        expect(true).toBeTruthy()

        const items = await table.getItems({ filter: { transferId: data.transferId }})
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

        const updatedData = Object.assign({}, data, {
          to: generateRandomAddress()
        })

        await table.upsertItem(updatedData)

        const newItems = await table.getItems({ filter: { transferId: data.transferId }})
        expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
      }, 60 * 1000)
    })
    describe('TransferBondedTable', () => {
      it('should put, get, and update data', async () => {
        const db = pgp({})({ ...postgresConfig })
        const table = new TransferBondedTable(db)

        const event = generateMockTransferBonded()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)
        expect(true).toBeTruthy()

        const items = await table.getItems({ filter: { transferId: data.transferId }})
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

        const updatedData = Object.assign({}, data, {
          amount: generateRandomUint256()
        })

        await table.upsertItem(updatedData)

        const newItems = await table.getItems({ filter: { transferId: data.transferId }})
        expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
      }, 60 * 1000)
    })
  })
})
