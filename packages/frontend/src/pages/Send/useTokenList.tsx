import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import tokenListJson from './tokenlist.json'
import { useV2 } from '#hooks/useV2.js'
import { ethers } from 'ethers'
import { PriceFeed, utils as v2Utils } from '@hop-protocol/v2-sdk'

const { formatUSD } = v2Utils

// Utility function to generate tokens from JSON
function generateTokenListFromJson(tokenListJson: any) {
  return tokenListJson.tokens.map((token: any) => ({
    chainId: token.chainId,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.logoURI,
  }))
}

// Hook to manage token list logic
export const useTokenList = (selectedChainId = '') => {
  const { v2Sdk, getTokenInfoByTokenAddress, account } = useV2()
  const [customTokenListUrl, setCustomTokenListUrl] = useLocalStorage<string | null>('customTokenListUrl', null)
  const [tokenList, setTokenList] = useState(normalize(generateTokenListFromJson(tokenListJson)))
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredTokens, setFilteredTokens] = useState(tokenList)
  const [chainFilter, setChainFilter] = useState(selectedChainId)
  const [error, setError] = useState<string | null>(null)


  function normalize(list: any[]) {
    return list.map((token) => {
      const chainInfo = v2Sdk.utils.getChainInfo(token.chainId)
      const chainName = chainInfo?.name ?? ''
      const chainSlug = chainInfo?.slug ?? ''
      const chainPrimaryColor = chainInfo?.primaryColor ?? ''
      return {
        ...token,
        chainName,
        chainSlug,
        chainPrimaryColor
      }
    })
  }

  // Handle fetching token list from a custom URL
  const fetchTokenListFromUrl = useCallback(async (url: string) => {
    setError(null)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch token list. Please check the URL.')
      }
      const json = await response.json()
      const tokens = generateTokenListFromJson(json)
      setTokenList(tokens)
      setCustomTokenListUrl(url)
    } catch (error) {
      setError((error as Error).message)
    }
  }, [setCustomTokenListUrl])

  // Load token list from custom URL or default JSON
  useEffect(() => {
    if (customTokenListUrl) {
      fetchTokenListFromUrl(customTokenListUrl)
    } else {
      setTokenList(generateTokenListFromJson(tokenListJson))
    }
  }, [customTokenListUrl, fetchTokenListFromUrl])

  // Filter tokens based on search and chain filter
  useEffect(() => {
    const searchLower = search.toLowerCase().trim()

    const filterTokens = (tokens: any[]) => {
      return tokens.filter((token) => {
        const matchesSearch =
          token.name.toLowerCase().includes(searchLower) ||
          token.symbol.toLowerCase().includes(searchLower) ||
          token.address.toLowerCase().includes(searchLower)

        const matchesChain = chainFilter ? token.chainId?.toString() === chainFilter : true

        return matchesSearch && matchesChain
      })
    }

    // Filter the existing token list
    let filtered = filterTokens(tokenList)

    if (filtered.length === 0 && v2Sdk.utils.isValidAddress(searchLower)) {
      // Fetch and append token info if the search is a valid token address
      const update = async () => {
        try {
          const tokenInfo = await getTokenInfoByTokenAddress(chainFilter, searchLower)
          if (tokenInfo) {
            const { address, chainId, decimals, name, symbol } = tokenInfo
            const logoURI = `https://assets.hop.exchange/logos/${symbol.toLowerCase()}.svg`

            const newToken = {
              address,
              chainId,
              decimals,
              name,
              symbol,
              logoURI,
            }

            // Check if the token already exists in the list
            const tokenExists = tokenList.some(
              (token) => token.address.toLowerCase() === address.toLowerCase() && token.chainId === chainId
            )

            if (!tokenExists) {
              // Append the new token to the existing token list
              const updatedTokenList = [...tokenList, newToken]
              setTokenList(updatedTokenList)

              // Re-filter the updated token list to show only the newly added token
              filtered = filterTokens(updatedTokenList)
            }
          } else {
            setFilteredTokens([]) // If tokenInfo is null, show no results
            return
          }
        } catch (err) {
          console.error('useTokenList:', err)
          setFilteredTokens([]) // If there was an error, show no results
          return
        }
      }

      update()
    }

    filtered = normalize(filtered)

    async function update() {
      if (!account) {
        setFilteredTokens(filtered)
        return
      }
      const tokensWithBalanceAndPrice = await Promise.all(
        filtered.map(async (token) => {
          try {
            const priceFeed = new PriceFeed()
            const railsGateway = v2Sdk.getRailsGateway(token.chainId)
            const contract = railsGateway.getTokenContract( { address: token.address })
            const balance = await contract.balanceOf(account)
            if (balance.eq(0)) {
              return {
                ...token,
              }
            }
            const balanceFormatted = ethers.utils.formatUnits(balance, token.decimals)
            const tokenPrice = await priceFeed.getPriceByTokenSymbol(token.symbol)
            const balanceUsd = Number(balanceFormatted) * tokenPrice
            const balanceUsdDisplay = formatUSD(balanceUsd)

            return {
              ...token,
              balanceFormatted,
              balanceUsd,
              balanceUsdDisplay,
            }
          } catch (err: any) {
            console.error('fetch error', err)
            return {
              ...token,
            }
          }
        })
      )

      setFilteredTokens([...tokensWithBalanceAndPrice])
    }

    update()
  }, [search, chainFilter, tokenList, account])

  const handleChainFilterChange = (event: any) => {
    setChainFilter(event.target.value as string)
  }

  const deleteCustomTokenList = () => {
    setCustomTokenListUrl(null)
    setTokenList(generateTokenListFromJson(tokenListJson))
    setError(null)
  }

  const sorted = filteredTokens?.sort((a, b) => {
    // Ensure balanceUsd exists, if not, assume 0 for comparison
    const balanceUsdA = a.balanceUsd || 0
    const balanceUsdB = b.balanceUsd || 0

    // First, sort by balanceUsd in descending order (largest balance first)
    if (balanceUsdB !== balanceUsdA) {
      return balanceUsdB - balanceUsdA
    }

    // If balanceUsd is the same, sort alphabetically by token.symbol
    if (a.symbol.toLowerCase() !== b.symbol.toLowerCase()) {
      return a.symbol.toLowerCase().localeCompare(b.symbol.toLowerCase())
    }

    // If token.symbol is also the same, sort alphabetically by chainName
    return a.chainName.toLowerCase().localeCompare(b.chainName.toLowerCase())
  })

  const filteredSorted= sorted.filter((item: any) => {
    return item.chainId?.toString() !== '42069'
  })

  return {
    open,
    search,
    filteredTokens: filteredSorted,
    chainFilter,
    handleOpen: () => setOpen(true),
    handleClose: () => setOpen(false),
    setSearch,
    handleChainFilterChange,
    fetchTokenListFromUrl,
    deleteCustomTokenList,
    customTokenListUrl,
    error,
  }
}
