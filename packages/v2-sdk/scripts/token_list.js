const { TokenList } = require('@uniswap/token-lists')
const fs = require('fs')
const path = require('path')

const { addresses } = require('../dist/cjs/addresses/sepolia.js')

// Run with: node scripts/token_list.js

// Mock function to simulate fetching token details dynamically by address
async function fetchTokenDetails(chainId, address) {
  // Simulate fetching token details (replace this with real data fetching logic)
  const tokenMetadata = {
    '0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf': { name: 'Mock Token', symbol: 'MOCK', decimals: 18 },
    '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238': { name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    '0x036CbD53842c5426634e7929541eC2318f3dCF7e': { name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    '0x36d3f5501Ef2BA0ea329c46C5A4a463C163e1ff0': { name: 'USD Coin', symbol: 'USDC', decimals: 6 }
  }

  const tokenInfo = tokenMetadata[address]
  if (!tokenInfo) {
    throw new Error(`Token information not found for address: ${address}`)
  }

  return tokenInfo
}

// Helper function to generate token entries for a specific chain and token details
async function generateTokenEntry(chainId, tokenAddress) {
  const { name, symbol, decimals } = await fetchTokenDetails(chainId, tokenAddress)

  return {
    chainId: parseInt(chainId, 10),
    address: tokenAddress,
    name: name,
    symbol: symbol,
    decimals: decimals,
    logoURI: `https://assets.hop.exchange/logos/${symbol.toLowerCase()}.svg`,
  }
}

async function generateMyTokenList() {
  const tokens = []

  // Loop through each chain and add token entries for all tokens in that chain
  for (const [chainId, chainData] of Object.entries(addresses)) {
    const tokensInChain = chainData.tokens
    for (const [tokenSymbol, tokenAddress] of Object.entries(tokensInChain)) {
      tokens.push(await generateTokenEntry(chainId, tokenAddress))
    }
  }

  // Return the token list in the Uniswap format
  return {
    name: 'Hop Token List',
    timestamp: new Date().toISOString(),
    version: {
      major: 1,
      minor: 0,
      patch: 0,
    },
    tokens,
    logoURI: 'https://assets.hop.exchange/logos/hop.png',
    keywords: ['tokens', 'cross-chain', 'stablecoin', 'hop protocol'],
    tags: {
      stablecoin: {
        name: 'Stablecoin',
        description: 'Tokens that are stable relative to an external asset, like the US dollar',
      },
    },
  }
}

// Main function to generate token list and write to file
async function main() {
  try {
    const myList = await generateMyTokenList()

    // Ensure the 'output' directory exists
    const outputDir = path.resolve(__dirname, 'output')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }

    // Write token list to 'token-list.json' file
    const filePath = path.join(outputDir, 'token-list.json')
    fs.writeFileSync(filePath, JSON.stringify(myList, null, 2), 'utf-8')

    console.log(`Token list written to ${filePath}`)
  } catch (error) {
    console.error('Error generating token list:', error.message)
  }
}

// Run the main function
main()
