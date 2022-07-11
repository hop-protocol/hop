import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { useTheme } from '@material-ui/core'
import { ExternalLink } from 'src/components/Link'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'

type Item = {
  transferId: string
  sourceChainSlug: string
  sourceChainName: string
  destinationChainSlug: string
  destinationChainName: string
  transactionHash: string
  transactionHashExplorerUrl: string
  bondTransactionHashExplorerUrl: string
  sourceChainImageUrl: string
  destinationChainImageUrl: string
  amountDisplay: string
  token: string
  tokenImageUrl: string
  timestampRelative: string
  bondWithinTimestampRelative: string
}

function useData(props: any) {
  const { address } = props
  const [items, setItems] = useState<Item[]>([])
  const [perPage] = useState<number>(5)
  const [page, setPage] = useState<number>(0)
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

  useEffect(() => {
    async function update() {
      if (!address) {
        setItems([])
        return
      }
      const url = `https://explorer-api.hop.exchange/v1/transfers?account=${address}&perPage=${perPage}&page=${page}`
      const res = await fetch(url)
      const json = await res.json()
      const transfers = json.data
      if (Array.isArray(transfers)) {
        setItems(transfers)
      }
    }

    update().catch(console.error)
  }, [address, page])

  useEffect(() => {
    if (page === 0) {
      setHasPreviousPage(false)
    } else {
      setHasPreviousPage(true)
    }
    if (items.length === perPage) {
      setHasNextPage(true)
    } else {
      setHasNextPage(false)
    }
  }, [items, perPage])

  function handlePreviousPageClick(event: any) {
    event.preventDefault()
    if (page > 0) {
      setPage(page - 1)
    }
  }

  function handleNextPageClick(event: any) {
    event.preventDefault()
    setPage(page + 1)
  }

  return {
    items,
    hasPreviousPage,
    hasNextPage,
    handlePreviousPageClick,
    handleNextPageClick
  }
}

type Props = {
  address?: string
}

export function AccountTransferHistory (props: Props) {
  const { address } = props
  const theme = useTheme()
  const { items, hasPreviousPage, hasNextPage, handlePreviousPageClick, handleNextPageClick } = useData({ address })

  if (!items.length) {
    return (
      <div></div>
    )
  }

  return (
    <Box>
      <Box mt={4} mb={2}>
        <Box mb={2} width="100%" style={{ borderTop: `1px solid ${theme.palette.secondary.light}`, width: '100%', opacity: 0.5 }}></Box>
        <Typography variant="body1">
          Account transfers history
        </Typography>
      </Box>
      <Box>
        <Box>
          {items?.map((item: Item, i: number) => {
            return (
              <Box key={i} mb={3}>
                <Box mb={0.2} mr={1} display="flex">
                  <Typography variant="body2" component="span">
                    {item.timestampRelative}
                  </Typography>
                  {(item.bondWithinTimestampRelative) && (
                    <Box ml={1} display="inline-flex">
                      <Typography variant="body2" component="span" color="secondary">
                        ({item.sourceChainSlug === 'ethereum' ? 'recieved' : 'bonded'} {item.bondWithinTimestampRelative} ago)
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box display="flex" justifyItems="center" alignItems="center">
                  <Box mr={2} display="flex">
                    <Typography variant="body1" component="span">
                      <Box display="flex">{item.amountDisplay}
                      <Box ml={0.5} mr={0.5} display="inline-flex">
                        <img src={item.tokenImageUrl} width={16} alt="icon" />
                      </Box>
                      {item.token}</Box>
                    </Typography>
                  </Box>
                  <Box mr={0.5} display="flex">
                    <img src={item.sourceChainImageUrl} width={16} alt="icon" />
                  </Box>
                  {item.transactionHashExplorerUrl ? (
                    <ExternalLink href={item.transactionHashExplorerUrl}>{item.sourceChainName}</ExternalLink>
                  ) : (
                    <Box>{item.sourceChainName}</Box>
                  )}
                  <Box ml={1} mr={1} display="flex">→</Box>
                  <Box mr={0.5} display="flex">
                    <img src={item.destinationChainImageUrl} width={16} alt="icon" />
                  </Box>
                  {item.bondTransactionHashExplorerUrl ? (
                    <ExternalLink href={item.bondTransactionHashExplorerUrl}>{item.destinationChainName}</ExternalLink>
                  ) : (
                    <Box>{item.destinationChainName}</Box>
                  )}
                </Box>
              </Box>
            )
          })}
        </Box>
        <Box display="flex" justifyContent="center">
          {hasPreviousPage && (
            <IconButton onClick={handlePreviousPageClick}><NavigateBeforeIcon fontSize="large" /></IconButton>
          )}
          {hasNextPage && (
            <IconButton onClick={handleNextPageClick}><NavigateNextIcon fontSize="large" /></IconButton>
          )}
        </Box>
      </Box>
    </Box>
  )
}
