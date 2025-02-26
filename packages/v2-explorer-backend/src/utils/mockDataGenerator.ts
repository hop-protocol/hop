import { BigNumber } from 'ethers'
import { BundleCommitted, BundleForwarded, BundleReceived, BundleSet, FeesSentToHub, MessageBundled, MessageExecuted, MessageSent, TransferSent, TransferBonded, HopStruct, EventContext, Path, Token, BonderPreference, ClaimPosted } from '@hop-protocol/v2-sdk'
import { Price } from '#pgDb/prices/index.js'

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

export function generateRandomWei() {
  // Generate a random integer and convert it to a BigNumber to simulate Wei
  return BigNumber.from(Math.floor(Math.random() * 10**18).toString()).toString()
}

export function generateRandomGwei() {
  // Gwei is 1e9 Wei, so we generate a random integer in this range
  return BigNumber.from(Math.floor(Math.random() * 10**9).toString()).toString()
}

// Function to generate mock EventContext
export function generateMockEventContext(eventName: string = ''): EventContext & { dataDecoded?: any } {
  const context: EventContext & { dataDecoded?: any } = {
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
    value: generateRandomWei(),
    nonce: generateRandomInt(0, 1000),
    gasLimit: generateRandomInt(21_000, 1_000_000),
    gasUsed: generateRandomInt(21_000, 1_000_000),
    gasPrice: generateRandomGwei(),
    data: '0x' + Array.from({ length: 200 }, () => Math.floor(Math.random() * 16).toString(16)).join(''), // Random hex data
    dataDecoded: null
  }

  return context
}

// Messenger

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

// Function to generate mock BundleForwarded
export function generateMockBundleForwarded(): BundleForwarded {
  return {
    bundleId: generateRandomBytes32(),
    bundleRoot: generateRandomBytes32(),
    fromChainId: generateRandomInt(1, 10).toString(), // Example chain ID as string
    toChainId: generateRandomInt(1, 10).toString() // Example chain ID as string
  }
}

// Function to generate mock BundleReceived
export function generateMockBundleReceived(): BundleReceived {
  return {
    bundleId: generateRandomBytes32(),
    bundleRoot: generateRandomBytes32(),
    bundleFees: generateRandomUint256(),
    fromChainId: generateRandomInt(1, 10).toString(), // Example chain ID as string
    toChainId: generateRandomInt(1, 10).toString(), // Example chain ID as string
    relayWindowStart: generateRandomUnixTime(), // Random Unix timestamp
    relayer: generateRandomAddress() // Random Ethereum address
  }
}

// Function to generate mock BundleSet
export function generateMockBundleSet(): BundleSet {
  return {
    bundleId: generateRandomBytes32(),
    bundleRoot: generateRandomBytes32(),
    fromChainId: generateRandomInt(1, 10).toString() // Example chain ID as string
  }
}

// Function to generate mock FeesSentToHub
export function generateMockFeesSentToHub(): FeesSentToHub {
  return {
    amount: generateRandomUint256() // Random BigNumber
  }
}

// Function to generate mock MessageBundled
export function generateMockMessageBundled(): MessageBundled {
  return {
    messageId: generateRandomBytes32(),
    bundleId: generateRandomBytes32(),
    treeIndex: generateRandomInt(0, 100) // Random integer for tree index
  }
}

// Function to generate mock MessageExecuted
export function generateMockMessageExecuted(): MessageExecuted {
  return {
    messageId: generateRandomBytes32(),
    fromChainId: generateRandomInt(1, 10).toString() // Example chain ID as string
  }
}

// Function to generate mock MessageSent
export function generateMockMessageSent(): MessageSent {
  return {
    messageId: generateRandomBytes32(),
    from: generateRandomAddress(), // Random Ethereum address
    toChainId: generateRandomInt(1, 10).toString(), // Example chain ID as string
    to: generateRandomAddress(), // Random Ethereum address
    data: '0x' + Array.from({ length: 200 }, () => Math.floor(Math.random() * 16).toString(16)).join('') // Random hex data
  }
}

// RailsGateway

// Function to generate mock HopStruct
export function generateMockHopStruct(): HopStruct {
  return {
    pathId: generateRandomBytes32(),
    maxTotalSent: generateRandomUint256(),
    maxBonderFee: generateRandomUint256(),
    attestedClaimId: generateRandomBytes32()
  }
}

// Function to generate mock TransferSent
export function generateMockTransferSent(numHops: number = generateRandomInt(1, 5)): TransferSent {
  const hops = Array.from({ length: numHops }, generateMockHopStruct).map((item: any, i: number) => ({ ...item, index: i }))

  return {
    transferId: generateRandomBytes32(),
    pathId: generateRandomBytes32(),
    to: generateRandomAddress(),
    amount: generateRandomUint256(),
    sourcePool: generateRandomUint256(),
    hops: hops,
  }
}

// Function to generate mock TransferBonded
export function generateMockTransferBonded(): TransferBonded {
  return {
    pathId: generateRandomBytes32(),
    claimId: generateRandomBytes32(),
    to: generateRandomAddress(),
    amount: generateRandomUint256(),
    bonderFee: generateRandomUint256(),
  }
}

// Function to generate mock ClaimPosted
export function generateMockClaimPosted(): ClaimPosted {
  return {
    pathId: generateRandomBytes32(),
    claimId: generateRandomBytes32(),
  }
}

// Function to generate mock BonderPreference
export function generateMockBonderPreference(): BonderPreference {
  return {
    bonder: generateRandomAddress(),
    pathId: generateRandomBytes32(),
    feeTier: generateRandomUint256(),
    liquidity: generateRandomUint256()
  }
}

// Paths

export function generateMockPath(): Path {
  return {
    pathId: generateRandomBytes32(),
    chainId: generateRandomInt(1, 10).toString(), // Example chain ID as a string
    token: generateRandomAddress(), // Random Ethereum address
    counterpartToken: generateRandomAddress(), // Random Ethereum address
    counterpartChainId: generateRandomInt(1, 10).toString(), // Example counterpart chain ID as a string
    initialReserve: generateRandomUint256(),
  }
}

// Prices


export function generateMockPrice(): Price {
  return {
    token: generateRandomString(5).toUpperCase(), // Generates a random token symbol with length between 3 and 5 characters, converted to uppercase
    priceUsd: Number((Math.random() * 1000).toFixed(2)), // Generates a random price in USD, formatted as a string with two decimal places
    timestamp: generateRandomUnixTime() // Random Unix timestamp
  }
}

// Tokens

export function generateMockToken(): Token {
  return {
    chainId: generateRandomInt(1, 10).toString(), // Example chain ID as a string
    address: generateRandomAddress(), // Generates a random Ethereum address
    name: generateRandomString(12), // Generates a random name with length between 5 and 12 characters
    symbol: generateRandomString(5).toUpperCase(), // Generates a random symbol with length between 3 and 5 characters, converted to uppercase
    decimals: generateRandomInt(6, 18) // Random integer between 6 and 18 for decimals
  }
}
