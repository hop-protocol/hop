import { useState, useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import tokenListJson from './tokenlist.json'

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
  const [customTokenListUrl, setCustomTokenListUrl] = useLocalStorage<string | null>('customTokenListUrl', null)
  const [tokenList, setTokenList] = useState(generateTokenListFromJson(tokenListJson))
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredTokens, setFilteredTokens] = useState(tokenList)
  const [chainFilter, setChainFilter] = useState(selectedChainId)
  const [error, setError] = useState<string | null>(null) // Add error state

  // Handle fetching token list from a custom URL
  const fetchTokenListFromUrl = async (url: string) => {
    setError(null) // Clear previous error before fetching
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch token list. Please check the URL.') // Handle non-OK responses
      }
      const json = await response.json()
      const tokens = generateTokenListFromJson(json)
      setTokenList(tokens)
      setCustomTokenListUrl(url)
    } catch (error) {
      setError((error as Error).message) // Capture and set the error
    }
  }

  // Load token list from custom URL or default JSON
  useEffect(() => {
    if (customTokenListUrl) {
      fetchTokenListFromUrl(customTokenListUrl)
    } else {
      setTokenList(generateTokenListFromJson(tokenListJson)) // Load default list
    }
  }, [customTokenListUrl])

  // Filter tokens based on search and chain filter
  useEffect(() => {
    const searchLower = search.toLowerCase()
    const filtered = tokenList.filter((token) => {
      const matchesSearch =
        token.name.toLowerCase().includes(searchLower) ||
        token.symbol.toLowerCase().includes(searchLower) ||
        token.address.toLowerCase().includes(searchLower)

      const matchesChain = chainFilter ? token.chainId === parseInt(chainFilter) : true

      return matchesSearch && matchesChain
    })
    setFilteredTokens(filtered)
  }, [search, chainFilter, tokenList])

  const handleChainFilterChange = (event: any) => {
    setChainFilter(event.target.value as string)
  }

  // Function to delete custom token list and revert to default
  const deleteCustomTokenList = () => {
    setCustomTokenListUrl(null)
    setTokenList(generateTokenListFromJson(tokenListJson)) // Revert to default list
    setError(null) // Clear error after deleting custom token list
  }

  return {
    open,
    search,
    filteredTokens,
    chainFilter,
    handleOpen: () => setOpen(true),
    handleClose: () => setOpen(false),
    setSearch,
    handleChainFilterChange,
    fetchTokenListFromUrl,  // Expose function to fetch token list from custom URL
    deleteCustomTokenList,  // Expose function to delete custom token list
    customTokenListUrl,     // Expose custom token list URL
    error,                  // Expose error
  }
}
