import React, { useState, useEffect } from 'react'
import Skeleton from '@mui/lab/Skeleton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import { ExternalLink } from 'src/components/Link'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import { useQuery } from 'react-query'
import useQueryParams from 'src/hooks/useQueryParams'
import { InfoTooltip } from 'src/components/InfoTooltip'
import { isMainnet, reactAppNetwork } from 'src/config'

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
  bondTimestampRelative: string
  bondStatusColor: string
  receivedHTokens: boolean
  convertHTokenUrl: string
  bonded: boolean
  accountAddress: string
  recipientAddress: string
  recipientAddressTruncated: string
  recipientAddressExplorerUrl: string
  hopExplorerUrl: string
}

function useData(props: any) {
  const { queryParams } = useQueryParams()
  const address = queryParams.address ?? props.address
  const [perPage] = useState<number>(5)
  const [page, setPage] = useState<number>(1)
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

  const queryKey = `accountTransfersHistory:${address}:${perPage}:${page}`
  const { isLoading, data, error } = useQuery(
    [queryKey, address, page, perPage],
    async () => {
      if (!address) {
        return []
      }
      const baseUrl = isMainnet ? 'https://explorer-api.hop.exchange' : `https://${reactAppNetwork}-explorer-api.hop.exchange`
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

  const queryKeyVolume = `accountVolumeUsd:${address}`
  const { data: volumeUsd } = useQuery(
    [queryKeyVolume, address],
    async () => {
      if (!address) {
        return []
      }
      const baseUrl = isMainnet ? 'https://explorer-api.hop.exchange' : `https://${reactAppNetwork}-explorer-api.hop.exchange`
      // const baseUrl = 'http://localhost:8000'
      const url = `${baseUrl}/v1/accounts?account=${address}`
      const res = await fetch(url)
      const json = await res.json()
      const _volumeUsd = json.data?.[0]?.volumeUsdDisplay
      if (!_volumeUsd) {
        return ''
      }
      return _volumeUsd
    },
    {
      enabled: !!address,
      refetchInterval: 60 * 1000,
    }
  )

  const items = data ?? []

  useEffect(() => {
    if (page === 1) {
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
    if (page > 1) {
      setPage(Math.max(page - 1, 1))
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
    handleNextPageClick,
    volumeUsd
  }
}

type Props = {
  address?: string
}

export function AccountTransferHistory (props: Props) {
  const { address } = props
  const theme = useTheme()
  const { isLoading, items, hasPreviousPage, hasNextPage, handlePreviousPageClick, handleNextPageClick, volumeUsd } = useData({ address })

  if (!items.length && !isLoading) {
    return (
      <></>
    )
  }

  const baseUrl = isMainnet ? 'https://explorer.hop.exchange' : `https://${reactAppNetwork}.explorer.hop.exchange`
  const explorerLink = `${baseUrl}/?account=${address}`

  return (
    <Box>
      <Box mt={4} mb={2}>
        <Box mb={2} width="100%" style={{ borderTop: `1px solid ${theme.palette.secondary.light}`, width: '100%', opacity: 0.5 }}></Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body1">
            Account transfer history
          </Typography>
          {items?.length > 0 && (
            <Typography variant="body2">
              <ExternalLink href={explorerLink}>View in explorer</ExternalLink>
            </Typography>
          )}
        </Box>
      </Box>
      <Box>
        <Box>
          {isLoading && (
            <Box>
              <Skeleton animation="wave" width={'20%'} />
              <Skeleton animation="wave" width={'100%'} />
              <Skeleton animation="wave" width={'20%'} />
              <Skeleton animation="wave" width={'100%'} />
            </Box>
          )}
          {items?.map((item: Item, i: number) => {
            if (!item) {
              return null
            }
            const showRecipient = item.recipientAddress && (item.accountAddress?.toLowerCase() !== item.recipientAddress?.toLowerCase())
            return (
              <Box key={i} mb={3}>
                <Box mb={0.2} mr={1} display="flex">
                  <Typography variant="body2" component="span">
                    <ExternalLink style={{ color: theme.palette.text.primary }} href={item?.hopExplorerUrl}>{item?.timestampRelative ?? ''}</ExternalLink>
                  </Typography>
                  {!!item?.bondTimestampRelative && (
                    <Box ml={1} display="inline-flex">
                      <Typography variant="body2" component="span" color="secondary">
                        (<span style={{ color: '#52c106' }}>{item.sourceChainSlug === 'ethereum' ? 'received' : 'bonded'}</span> {item.bondTimestampRelative ?? ''})
                      </Typography>
                    </Box>
                  )}
                  {!item?.bonded && (
                    <Box ml={1} display="inline-flex">
                      <Typography variant="body2" component="span" color="secondary">
                        (<span>pending</span> <InfoTooltip title="This may take 5-15 minutes depending on the route" />)
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box display="flex" justifyItems="center" alignItems="center">
                  <Box mr={2} display="flex">
                    <Typography variant="body1" component="span">
                      <Box display="flex">{item?.amountDisplay ?? ''}
                        {!!item?.tokenImageUrl && (
                          <Box ml={0.5} mr={0.5} display="inline-flex">
                            <img src={item.tokenImageUrl} width={16} alt="icon" />
                          </Box>
                        )}
                      {item?.token ?? ''}</Box>
                    </Typography>
                  </Box>
                  {!!item?.sourceChainImageUrl && (
                    <Box mr={0.5} display="flex">
                      <img src={item.sourceChainImageUrl} width={16} alt="icon" />
                    </Box>
                  )}
                  <Box display="inline-flex" style={{ color: item?.sourceChainColor }}>
                    {item?.transactionHashExplorerUrl ? (
                      <ExternalLink href={item.transactionHashExplorerUrl} style={{ color: item?.sourceChainColor }}>{item?.sourceChainName ?? ''}</ExternalLink>
                    ) : (
                      <Box>{item?.sourceChainName ?? ''}</Box>
                    )}
                    <Box ml={0.2} mr={1} display="flex">→</Box>
                  </Box>
                  {!!item?.destinationChainImageUrl && (
                    <Box mr={0.5} display="flex">
                      <img src={item.destinationChainImageUrl} width={16} alt="icon" />
                    </Box>
                  )}
                  <Box display="inline-flex" style={{ color: item?.destinationChainColor }}>
                    {item?.bondTransactionHashExplorerUrl ? (
                      <ExternalLink href={item?.bondTransactionHashExplorerUrl} style={{ color: item?.destinationChainColor }}>{item?.destinationChainName}</ExternalLink>
                    ) : (
                      <Box>{item?.destinationChainName ?? ''}</Box>
                    )}
                  </Box>
                  <Box ml={2} display="inline-flex">
                    <Typography variant="body2">
                      {(item?.receivedHTokens && item?.convertHTokenUrl) && (
                        <ExternalLink href={item?.convertHTokenUrl.replace('https://app.hop.exchange', '')}>click to swap h{item?.token}{'<>'}{item?.token}</ExternalLink>
                      )}
                    </Typography>
                  </Box>
                </Box>
                {showRecipient && (
                  <Box>
                    <Typography variant="body2">
                      Recipient: <ExternalLink href={item.recipientAddressExplorerUrl}>{item.recipientAddressTruncated}</ExternalLink> <InfoTooltip title={`This transfer had the recipient address set to ${item.recipientAddress}`} />
                    </Typography>
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
        <Box mb={2} display="flex" justifyContent="center">
          {hasPreviousPage && (
            <IconButton onClick={handlePreviousPageClick}><NavigateBeforeIcon fontSize="large" /></IconButton>
          )}
          {hasNextPage && (
            <IconButton onClick={handleNextPageClick}><NavigateNextIcon fontSize="large" /></IconButton>
          )}
        </Box>
        {!!volumeUsd && (
          <Box mb={2} display="flex" justifyContent="center">
            <Typography variant="body2" component="span" title="Cumulative volume in USD on Hop from connected account">
              <span aria-label="Medal">🏅</span> Cumulative Volume: {volumeUsd}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
