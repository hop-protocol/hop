import { useState, useEffect } from 'react'
import tokenListJson from './tokenlist.json'

function generateTokenListFromJson(tokenListJson: any) {
  const tokens = tokenListJson.tokens.map((token: any) => ({
    chainId: token.chainId,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.logoURI,
  }))

  return tokens
}

const tokenList = generateTokenListFromJson(tokenListJson)

export const useTokenList = (selectedChainId = '') => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredTokens, setFilteredTokens] = useState(tokenList)
  const [chainFilter, setChainFilter] = useState(selectedChainId)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
  }, [search, chainFilter])

  const handleChainFilterChange = (event: any) => {
    setChainFilter(event.target.value as string)
  }

  return {
    open,
    search,
    filteredTokens,
    chainFilter,
    handleOpen,
    handleClose,
    setSearch,
    handleChainFilterChange
  }
}
