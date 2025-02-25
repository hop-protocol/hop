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
import { ClaimPostedTable } from '#pgDb/events/railsGateway/ClaimPosted.js'
import { ClaimChainUpdatedTable } from '#pgDb/events/railsGateway/ClaimChainUpdated.js'
import { BonderPreferenceTable } from '#pgDb/events/railsGateway/BonderPreference.js'
import { PathTable } from '#pgDb/paths/index.js'
import { PriceTable } from '#pgDb/prices/index.js'
import { TokenTable } from '#pgDb/tokens/index.js'
import { postgresConfig } from '#config/index.js'
import {
  generateMockBundleCommitted,
  generateMockEventContext,
  generateRandomInt,
  generateMockTransferSent,
  generateMockTransferBonded,
  generateRandomAddress,
  generateRandomUint256,
  generateMockBundleForwarded,
  generateMockBundleReceived,
  generateMockBundleSet,
  generateMockFeesSentToHub,
  generateMockMessageBundled,
  generateMockMessageExecuted,
  generateMockMessageSent,
  generateRandomBytes32,
  generateMockPath,
  generateMockToken,
  generateRandomString,
  generateMockPrice,
  generateMockBonderPreference,
  generateMockClaimPosted,
  generateMockClaimChainUpdated
} from '#utils/mockDataGenerator.js'
import { deterministicStringify } from '#utils/deterministicStringify.js'

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
        const table = new BundleForwardedTable(db)
        const event = generateMockBundleForwarded()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)

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

        const items = await table.getItems({ amount: data.amount })
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
  })

  describe('RailsGateway', () => {
    describe('TransferSentTable', () => {
      it('should put, get, and update data', async () => {
        const table = new TransferSentTable(db)

        const event = generateMockTransferSent()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)

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
        const table = new TransferBondedTable(db)

        const event = generateMockTransferBonded()
        const context = generateMockEventContext()
        delete (context as any).eventName // not used
        delete (context as any).chainSlug // not used

        const data = { ...event, context }
        await table.upsertItem(data)

        const items = await table.getItems({ filter: { claimId: data.claimId }})
        expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

        const updatedData = Object.assign({}, data, {
          amount: generateRandomUint256()
        })

        await table.upsertItem(updatedData)

        const newItems = await table.getItems({ filter: { claimId: data.claimId }})
        expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
      }, 60 * 1000)
    })
  })

  describe('PathTable', () => {
    it('should put, get, and update data', async () => {
      const table = new PathTable(db)

      const data = generateMockPath()

      await table.upsertItem(data)

      const items = await table.getItems({ filter: { pathId: data.pathId }})
      const item = items[0]

      delete (item as any).tokenDecimals // not used
      delete (item as any).tokenSymbol // not used
      delete (item as any).tokenName // not used
      delete (item as any).counterpartTokenDecimals // not used
      delete (item as any).counterpartTokenSymbol // not used
      delete (item as any).counterpartTokenName // not used

      expect(deterministicStringify(item)).toEqual(deterministicStringify(data))

      const updatedData = Object.assign({}, data, {
        chainId: generateRandomInt().toString()
      })

      await table.upsertItem(updatedData)

      const newItems = await table.getItems({ filter: { pathId: data.pathId }})
      const newUpdatedData = newItems[0]

      delete (newUpdatedData as any).tokenDecimals // not used
      delete (newUpdatedData as any).tokenSymbol // not used
      delete (newUpdatedData as any).tokenName // not used
      delete (newUpdatedData as any).counterpartTokenDecimals // not used
      delete (newUpdatedData as any).counterpartTokenSymbol // not used
      delete (newUpdatedData as any).counterpartTokenName // not used

      expect(deterministicStringify(newUpdatedData)).toEqual(deterministicStringify(updatedData))
    }, 60 * 1000)
  })

  describe('PriceTable', () => {
    it('should put, get, and update data', async () => {
      const table = new PriceTable(db)

      const data = generateMockPrice()
      await table.upsertItem(data)

      const items = await table.getItems({ filter: { token: data.token }})
      expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

      const updatedData = Object.assign({}, data, {
        priceUsd: generateRandomInt(),
        timestamp: data.timestamp
      })

      await table.upsertItem(updatedData)

      const newItems = await table.getItems({ filter: { token: data.token }})
      expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
    }, 60 * 1000)
  })

  describe('TokenTable', () => {
    it('should put, get, and update data', async () => {
      const table = new TokenTable(db)

      const data = generateMockToken()
      await table.upsertItem(data)

      const items = await table.getItems({ filter: { address: data.address }})
      expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

      const updatedData = Object.assign({}, data, {
        name: generateRandomString(10)
      })

      await table.upsertItem(updatedData)

      const newItems = await table.getItems({ filter: { address: data.address }})
      expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
    }, 60 * 1000)
  })

  describe('ClaimPosted', () => {
    it('should put, get, and update data', async () => {
      const table = new ClaimPostedTable(db)

      const event = generateMockClaimPosted()

      const context = generateMockEventContext()
      delete (context as any).eventName // not used
      delete (context as any).chainSlug // not used

      const data = { ...event, context }
      await table.upsertItem(data)

      const items = await table.getItems({ filter: { claimId: data.claimId }})
      expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))
    }, 60 * 1000)
  })

  describe('ClaimChainUpdated', () => {
    it('should put, get, and update data', async () => {
      const table = new ClaimChainUpdatedTable(db)

      const event = generateMockClaimChainUpdated()

      const context = generateMockEventContext()
      delete (context as any).eventName // not used
      delete (context as any).chainSlug // not used

      const data = { ...event, context }
      await table.upsertItem(data)

      const items = await table.getItems({ filter: { headClaimId: data.headClaimId }})
      expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

      const updatedData = Object.assign({}, data, {
        length: generateRandomUint256()
      })

      await table.upsertItem(updatedData)

      const newItems = await table.getItems({ filter: { headClaimId: data.headClaimId }})
      expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
    }, 60 * 1000)
  })

  describe('BonderPreference', () => {
    it('should put, get, and update data', async () => {
      const table = new BonderPreferenceTable(db)

      const event = generateMockBonderPreference()

      const context = generateMockEventContext()
      delete (context as any).eventName // not used
      delete (context as any).chainSlug // not used

      const data = { ...event, context }
      await table.upsertItem(data)

      const items = await table.getItems({ filter: { bonder: data.bonder }})
      expect(deterministicStringify(items[0])).toEqual(deterministicStringify(data))

      const updatedData = Object.assign({}, data, {
        feeTier: generateRandomUint256()
      })

      await table.upsertItem(updatedData)

      const newItems = await table.getItems({ filter: { bonder: data.bonder }})
      expect(deterministicStringify(newItems[0])).toEqual(deterministicStringify(updatedData))
    }, 60 * 1000)
  })
})
