import getRpcProvider from '@hop-protocol/hop-node-core/src/utils/getRpcProvider'
import { BigNumber } from 'ethers'
import { Chain } from '@hop-protocol/hop-node-core/src/constants'
import { Interface, formatUnits } from 'ethers/lib/utils'
import { actionHandler, parseString, root } from '../shared'
import {
  hopAccountAddresses,
  possibleYears,
  tokenDataForYear,
  tokenDecimals,
  tokens
} from 'src/cli/metrics/sharedMetrics'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'

root
  .command('bonder-balance')
  .description('Bonder balance for a bonder for a given year')
  .option('--year <YYYY>', 'The desired year', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  /// //////////////////////////////////////////////////////////
  // ************
  // 2020 is missing some Authereum addresses, like the relayers.
  // 2021 and beyond are accurate
  // A bonder's staked amount is not counted and should be manually added or derived
  // ************
  /// //////////////////////////////////////////////////////////

  let { year } = source
  year = Number(year)

  if (!year) {
    throw new Error('year is required')
  }

  if (!possibleYears.includes(year)) {
    throw new Error(`year must be one of ${possibleYears}`)
  }

  const tokenData = tokenDataForYear[year]
  console.log(`Using token data for ${year} with tokenData = ${JSON.stringify(tokenData, null, 2)}`)

  // Other
  const totalBalances: Record<string, number> = {}
  const totalBalancesLessStables: Record<string, number> = {}
  const coreAddresses = mainnetAddresses.bridges
  for (const hopAccountAddress of hopAccountAddresses) {
    for (const token in coreAddresses) {
      const tokenNetworkAddresses: any = coreAddresses[token]
      for (const chain in tokenNetworkAddresses) {
        // Get token addresses from core
        const tokenAddresses: string[] = getTokenAddressesFromCore(chain, tokenNetworkAddresses[chain])

        // Get the balance of each token
        for (const [index, tokenAddress] of tokenAddresses.entries()) {
          // When token bridges are inactive, we still want to check the balance of the canonical token
          if (Number(index) > 0 && tokenData.inactiveBridgeTokens[token]) continue

          // Skip LP tokens for HOP
          const isLpToken = Number(index) === 2
          if (isLpToken && token === tokens.HOP) continue

          const balance: BigNumber = await getBalance(chain, hopAccountAddress, tokenAddress, tokenData.blockNumbers[chain])
          const decimals = isLpToken ? 18 : tokenDecimals[token]
          const fmtBalance: number = Number(formatUnits(balance, decimals))

          const tokenPriceUsd = tokenData.tokenPrice[token]
          const balanceUsd = fmtBalance * tokenPriceUsd

          if (!totalBalances[hopAccountAddress]) {
            totalBalances[hopAccountAddress] = 0
          }
          if (!totalBalancesLessStables[hopAccountAddress]) {
            totalBalancesLessStables[hopAccountAddress] = 0
          }

          totalBalances[hopAccountAddress] = totalBalances[hopAccountAddress] + balanceUsd
          if (tokenData.tokenPrice[token] !== 1) {
            totalBalancesLessStables[hopAccountAddress] = totalBalancesLessStables[hopAccountAddress] + balanceUsd
          }
          console.log(`Balance of ${token} on ${chain} for ${hopAccountAddress} is ${balanceUsd.toString()} (${fmtBalance}) (including stables)`)
        }
      }
    }

    // Handle arbitrary tokens
    for (const chain in arbitraryTokenAddresses) {
      for (const token in arbitraryTokenAddresses[chain]) {
        const tokenAddress = arbitraryTokenAddresses[chain][token]

        // Token balance logic
        const balance: BigNumber = await getBalance(chain, hopAccountAddress, tokenAddress, tokenData.blockNumbers[chain])
        const decimals = tokenDecimals[token]
        const fmtBalance: number = Number(formatUnits(balance, decimals))

        // USD balance logic
        const tokenPriceUsd = tokenData.tokenPrice[token]
        const balanceUsd = fmtBalance * tokenPriceUsd

        if (!totalBalances[hopAccountAddress]) {
          totalBalances[hopAccountAddress] = 0
        }
        if (!totalBalancesLessStables[hopAccountAddress]) {
          totalBalancesLessStables[hopAccountAddress] = 0
        }

        totalBalances[hopAccountAddress] = totalBalances[hopAccountAddress] + balanceUsd
        if (tokenData.tokenPrice[token] !== 1) {
          totalBalancesLessStables[hopAccountAddress] = totalBalancesLessStables[hopAccountAddress] + balanceUsd
        }

        console.log(`Balance of ${token} on ${chain} for ${hopAccountAddress} is ${balanceUsd.toString()} (${fmtBalance})`)
      }
    }

    console.log(`\nTotal balance of ${hopAccountAddress} is ${totalBalances[hopAccountAddress]} (with stables)`)
    console.log(`Total balance of ${hopAccountAddress} is ${totalBalancesLessStables[hopAccountAddress]} (excluding stables))`)
    console.log('---')
  }

  // Log output
  console.log('******\n\n')
  console.log(`Year: ${year}\n`)
  console.log('Including Stables\n')
  for (const hopAccountAddress of hopAccountAddresses) {
    console.log(`${hopAccountAddress}, ${totalBalances[hopAccountAddress]}`)
  }

  console.log('\nExcludingStables\n')
  for (const hopAccountAddress of hopAccountAddresses) {
    console.log(`${hopAccountAddress}, ${totalBalancesLessStables[hopAccountAddress]}`)
  }
}

function getTokenAddressesFromCore (chain: string, addresses: any): string[] {
  if (chain === Chain.Ethereum) {
    return [addresses.l1CanonicalToken]
  }

  return [
    addresses.l2CanonicalToken,
    addresses.l2HopBridgeToken,
    addresses.l2SaddleLpToken
  ]
}

async function getBalance (chain: string, accountAddress: string, tokenAddress: string, blockNumber: number): Promise<BigNumber> {
  if (tokenAddress === '0x0000000000000000000000000000000000000000') {
    return getEthBalance(chain, accountAddress, blockNumber)
  } 
    return getTokenBalance(chain, accountAddress, tokenAddress, blockNumber)
  
}

async function getEthBalance (chain: string, accountAddress: string, blockNumber: number): Promise<BigNumber> {
  const res = await getRpcProvider(chain).getBalance(accountAddress, blockNumber)
  return BigNumber.from(res)
}

async function getTokenBalance (chain: string, accountAddress: string, tokenAddress: string, blockNumber: number): Promise<BigNumber> {
  const abi = ['function balanceOf(address) view returns (uint256)']
  const ethersInterface = new Interface(abi)
  const data = ethersInterface.encodeFunctionData(
    'balanceOf', [accountAddress]
  )
  const tx: any = {
    to: tokenAddress,
    data
  }
  const res = await getRpcProvider(chain).call(tx, blockNumber)
  if (res === '0x') {
    // Will occur if the token does not exist at the block number
    return BigNumber.from('0')
  }
  return BigNumber.from(res)
}

const arbitraryTokenAddresses: Record<string, Record<string, string>> = {
  [Chain.Ethereum]: {
    [tokens.WETH]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    [tokens.ENS]: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
    [tokens.GNO]: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
    [tokens.FRAX]: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
    [tokens.WBTC]: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    [tokens.SAFE]: '0x5aFE3855358E112B5647B952709E6165e1c1eEEe',
    [tokens.GRT]: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7'
  },
  [Chain.Gnosis]: {
    [tokens.GNO]: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'
  },
  [Chain.Polygon]: {},
  [Chain.Optimism]: {
    [tokens.OP]: '0x4200000000000000000000000000000000000042',
    [tokens.USDC]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85' // Circle USDC
  },
  [Chain.Arbitrum]: {
    [tokens.USDC]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' // Circle USDC
  },
  [Chain.Nova]: {},
  [Chain.Base]: {},
  [Chain.Linea]: {}
}
