import { BigNumber } from 'ethers'

// Assuming these are the interfaces provided
export interface HopStruct {
  pathId: string
  maxTotalSent: BigNumber
  attestedClaimId: string
}

export interface TransferSent {
  transferId: string
  to: string
  amount: BigNumber
  totalSent: BigNumber
  attestedClaimId: string
  attestedTotalClaims: BigNumber
  nextHops: HopStruct[]
}

// Types provided
export type BaseEventContext = {
  eventName: string;
  chainSlug: string;
  chainId: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  blockNumber: number;
};

export type ReceiptEventContext = Partial<{
  blockTimestamp: number;
  from: string;
  to: string;
  value: string;
  nonce: number;
  gasLimit: number;
  gasUsed: number;
  gasPrice: string;
  data: string;
}>;

export type EventContext = BaseEventContext & ReceiptEventContext;

// Helper function to generate random Ethereum address
function generateRandomAddress(): string {
  return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

// Helper function to generate random bytes32 string
function generateRandomBytes32(): string {
  return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

// Helper function to generate a random integer
function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate mock HopStruct
function generateMockHopStruct(): HopStruct {
  return {
    pathId: generateRandomBytes32(),
    maxTotalSent: BigNumber.from(Math.floor(Math.random() * 10000).toString()), // Random BigNumber
    attestedClaimId: generateRandomBytes32(),
  }
}

// Function to generate mock TransferSent
function generateMockTransferSent(numHops: number = 3): TransferSent {
  const nextHops = Array.from({ length: numHops }, generateMockHopStruct)

  return {
    transferId: generateRandomBytes32(),
    to: generateRandomAddress(),
    amount: BigNumber.from(Math.floor(Math.random() * 10000).toString()), // Random BigNumber
    totalSent: BigNumber.from(Math.floor(Math.random() * 10000).toString()), // Random BigNumber
    attestedClaimId: generateRandomBytes32(),
    attestedTotalClaims: BigNumber.from(Math.floor(Math.random() * 10000).toString()), // Random BigNumber
    nextHops: nextHops,
  }
}

// Function to generate mock EventContext
function generateMockEventContext(): EventContext {
  const context: EventContext = {
    // BaseEventContext fields
    eventName: 'MockEvent',
    chainSlug: 'ethereum',
    chainId: generateRandomInt(1, 10).toString(), // Example chain IDs as string
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
  };

  return context;
}

// describe('mock data', () => {
//   it('should generate mock TransferSent objects', () => {
//     // Example usage: Generate an array of 5 mock TransferSent objects
//     const mockData = Array.from({ length: 5 }, () => generateMockTransferSent())
//     console.log(mockData)
//     expect(mockData).toHaveLength(5)
//   })
//   it('should generate mock Ethereum transaction context', () => {
//     const mockTxContext = generateMockEventContext()
//     console.log(mockTxContext)
//     expect(mockTxContext).toBeDefined()
//   })
// })
