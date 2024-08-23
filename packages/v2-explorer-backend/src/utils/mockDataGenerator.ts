import { BigNumber } from 'ethers'
import { BundleCommitted, TransferSent, TransferBonded, HopStruct, EventContext } from '@hop-protocol/v2-sdk'

// Helper function to generate random Ethereum address
export function generateRandomAddress(): string {
  return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

// Helper function to generate random bytes32 string
export function generateRandomBytes32(): string {
  return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

// Helper function to generate a random integer
export function generateRandomInt(min: number = 0, max: number = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Function to generate a random uint256 value
export function generateRandomUint256(): BigNumber {
  return BigNumber.from(Math.floor(Math.random() * 10000).toString()) // Random BigNumber
}

// Function to generate a random Unix timestamp
export function generateRandomUnixTime(): number {
  return generateRandomInt(1_600_000_000, 1_700_000_000)
}

// Function to generate a random lowercase string
export function generateRandomString(length: number = 10): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('')
}

// Function to generate mock EventContext
export function generateMockEventContext(eventName: string = ''): EventContext {
  const context: EventContext = {
    // BaseEventContext fields
    eventName,
    chainSlug: generateRandomString(10),
    chainId: generateRandomInt().toString(),
    status: 1,
    transactionHash: generateRandomBytes32(),
    transactionIndex: generateRandomInt(0, 100),
    logIndex: generateRandomInt(0, 100),
    blockNumber: generateRandomInt(1_000_000, 15_000_000),

    // ReceiptEventContext fields (Partial)
    blockTimestamp: generateRandomInt(1_600_000_000, 1_700_000_000),
    from: generateRandomAddress(),
    to: generateRandomAddress(),
    value: (Math.random() * 1000).toFixed(18), // Random value in wei as a string
    nonce: generateRandomInt(0, 1000),
    gasLimit: generateRandomInt(21_000, 1_000_000),
    gasUsed: generateRandomInt(21_000, 1_000_000),
    gasPrice: (Math.random() * 100).toFixed(18), // Random gas price in wei as a string
    data: '0x' + Array.from({ length: 200 }, () => Math.floor(Math.random() * 16).toString(16)).join('') // Random hex data
  }

  return context
}

// Function to generate mock BundleCommitted
export function generateMockBundleCommitted(): BundleCommitted {
  return {
    bundleId: generateRandomBytes32(),
    bundleRoot: generateRandomBytes32(),
    bundleFees: generateRandomUint256(),
    toChainId: generateRandomInt().toString(),
    commitTime: generateRandomInt(1_600_000_000, 1_700_000_000) // Random Unix timestamp
  }
}

// Function to generate mock HopStruct
export function generateMockHopStruct(): HopStruct {
  return {
    pathId: generateRandomBytes32(),
    maxTotalSent: generateRandomUint256(),
    attestedClaimId: generateRandomBytes32()
  }
}

// Function to generate mock TransferSent
export function generateMockTransferSent(numHops: number = 3): TransferSent {
  const nextHops = Array.from({ length: numHops }, generateMockHopStruct)

  return {
    transferId: generateRandomBytes32(),
    to: generateRandomAddress(),
    amount: generateRandomUint256(),
    totalSent: generateRandomUint256(),
    attestedClaimId: generateRandomBytes32(),
    attestedTotalClaims: generateRandomUint256(),
    nextHops: nextHops,
  }
}

// Function to generate mock TransferBonded
export function generateMockTransferBonded(): TransferBonded {
  return {
    pathId: generateRandomBytes32(),
    transferId: generateRandomBytes32(),
    amount: generateRandomUint256()
  }
}
