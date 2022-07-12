import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { useTheme } from '@material-ui/core'
import { ExternalLink } from 'src/components/Link'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import { useQuery } from 'react-query'
import useQueryParams from 'src/hooks/useQueryParams'

type Item = {
  transferId: string
  sourceChainSlug: string
  sourceChainName: string
  sourceChainColor: string
  destinationChainSlug: string
  destinationChainName: string
  destinationChainColor: string
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
  bondStatusColor: string
  receivedHTokens: boolean
  convertHTokenUrl: string
}

function useData(props: any) {
  const { queryParams } = useQueryParams()
  const address = queryParams.address ?? props.address
  const [perPage] = useState<number>(5)
  const [page, setPage] = useState<number>(0)
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

const queryKey = `accountTransfersHistory:${address}:${perPage}:${page}`
  const { isLoading, data, error } = useQuery(
    [queryKey, address, page, perPage],
    async () => {
      if (!address) {
        return []
      }
      const baseUrl = 'https://explorer-api.hop.exchange'
      // const baseUrl = 'http://localhost:8000'
      const url = `${baseUrl}/v1/transfers?account=${address}&perPage=${perPage}&page=${page}`
      const res = await fetch(url)
      const json = await res.json()
      const transfers = json.data
      if (!Array.isArray(transfers)) {
        return []
      }
      return transfers
    },
    {
      enabled: !!address,
      refetchInterval: 10 * 1000,
    }
  )

  const items = data ?? []

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
    isLoading,
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
  const { isLoading, items, hasPreviousPage, hasNextPage, handlePreviousPageClick, handleNextPageClick } = useData({ address })

  if (!items.length && !isLoading) {
    return (
      <></>
    )
  }

  return (
    <Box>
      <Box mt={4} mb={2}>
        <Box mb={2} width="100%" style={{ borderTop: `1px solid ${theme.palette.secondary.light}`, width: '100%', opacity: 0.5 }}></Box>
        <Typography variant="body1">
          Account transfer history
        </Typography>
      </Box>
      <Box>
        <Box>
          {isLoading && (
            <Box>
              <Typography variant="body1">
                Loading...
              </Typography>
            </Box>
          )}
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
                        (<span style={{ color: '#52c106' }}>{item.sourceChainSlug === 'ethereum' ? 'received' : 'bonded'}</span> {item.bondWithinTimestampRelative} ago)
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
                  <Box display="inline-flex" style={{ color: item.sourceChainColor }}>
                    {item.transactionHashExplorerUrl ? (
                      <ExternalLink href={item.transactionHashExplorerUrl} style={{ color: item.sourceChainColor }}>{item.sourceChainName}</ExternalLink>
                    ) : (
                      <Box>{item.sourceChainName}</Box>
                    )}
                    <Box ml={0.2} mr={1} display="flex">→</Box>
                  </Box>
                  <Box mr={0.5} display="flex">
                    <img src={item.destinationChainImageUrl} width={16} alt="icon" />
                  </Box>
                  <Box display="inline-flex" style={{ color: item.destinationChainColor }}>
                    {item.bondTransactionHashExplorerUrl ? (
                      <ExternalLink href={item.bondTransactionHashExplorerUrl} style={{ color: item.destinationChainColor }}>{item.destinationChainName}</ExternalLink>
                    ) : (
                      <Box>{item.destinationChainName}</Box>
                    )}
                  </Box>
                  <Box ml={2} display="inline-flex">
                    <Typography variant="body2">
                      {(item.receivedHTokens && item.convertHTokenUrl) && (
                        <ExternalLink href={item.convertHTokenUrl.replace('https://app.hop.exchange', '')}>click to swap h{item.token}{'<>'}{item.token}</ExternalLink>
                      )}
                    </Typography>
                  </Box>
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
