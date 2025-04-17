'use client'
import React, { useEffect, useState } from 'react'
import { apiUrl, networkSlug, appApiHost } from '@/app/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material/styles'
import { DetailRow } from '@/app/t/[transferId]/DetailRow'
import StorageIcon from '@mui/icons-material/Storage'

export function Details() {
  const [details, setDetails] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const theme = useTheme()

  useEffect(() => {
    const hostname = typeof window === 'undefined' ? appApiHost : window.location.host
    const protocol = hostname.includes('localhost') ? 'http' : 'https'

    const pathname = `/contract-state`
    const url = `${protocol}://${hostname}/api/?pathname=${pathname}`
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((json) => {
        console.log('json', json)
        setDetails(Object.values(json.data))
        setLastUpdated(json.lastUpdated)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  const railsGatewayFields = [
    { value: 'chainLabel', label: 'Chain ID', imageUrl: 'chainImageUrl' },
    { value: 'railsGatewayAddress', label: 'Gateway Address', link: 'railsGatewayExplorerUrl' },
    { value: ['removeFee', 'removeFeeDisplay'], label: 'Remove Fee' },
    { value: ['pushClaimFee', 'pushClaimFeeDisplay'], label: 'Push Claim Fee' },
    { value: ['defaultTokenFee', 'defaultTokenFeeDisplay'], label: 'Default Token Fee' },
    { value: 'dispatcher', label: 'Dispatcher', link: 'dispatcherExplorerUrl' },
    { value: 'executor', label: 'Executor', link: 'executorExplorerUrl' },
    { value: 'feeManager', label: 'Fee Manager', link: 'feeManagerExplorerUrl' },
    { value: 'railsPathImplementation', label: 'Rails Path Implementation', link: 'railsPathImplementationExplorerUrl' },
    { value: 'stakingRegistryAddress', label: 'Staking Registry Address', link: 'stakingRegistryExplorerUrl' },
    { value: 'pathIds', label: 'Path Ids' },
    { value: 'eventNames', label: 'Events' },
  ]

  const stakingRegistryFields = [
    { value: 'chainLabel', label: 'Chain ID', imageUrl: 'chainImageUrl' },
    { value: 'stakingRegistryAddress', label: 'Registry Address', link: 'stakingRegistryExplorerUrl' },
    { value: 'challengePeriod', label: 'Challenge Period (Seconds)' },
    { value: 'appealPeriod', label: 'Appeal Period (Seconds)' },
    { value: ['minChallengeIncrease', 'minChallengeIncreaseDisplay'], label: 'Min Challenge Increase' },
    { value: ['fullAppeal', 'fullAppealDisplay'], label: 'Full Appeal' },
    { value: ['minHopStake', 'minHopStakeDisplay'], label: 'Min Hop Stake' },
    { value: 'hopToken', label: 'Hop Token', link: 'hopTokenExplorerUrl', imageUrl: 'hopTokenImageUrl' },
    { value: 'eventNames', label: 'Events' },
  ]

  // Render skeleton rows for tables
  const renderSkeletonRows = (count = 5) => {
    return Array(count).fill(0).map((_, index) => (
      <TableRow key={`skeleton-row-${index}`}>
        <TableCell style={{ width: '30%' }}>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="80%" />
        </TableCell>
      </TableRow>
    ));
  };

  // Render a skeleton section with title and table
  const renderSectionSkeleton = (title: string, rowCount = 5) => (
    <Box mb={2}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            {renderSkeletonRows(rowCount)}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Render a skeleton for an entire contract card
  const renderContractSkeleton = (index: number) => (
    <Paper key={`skeleton-contract-${index}`} elevation={2} sx={{ mb: 4, p: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant="text" width={120} height={32} />
      </Box>
      
      {renderSectionSkeleton("Rails Gateway", 5)}
      
      <Box ml={2} mb={2}>
        <Typography variant="subtitle1" gutterBottom>
          <Skeleton variant="text" width={80} />
        </Typography>
        {renderSectionSkeleton("Paths", 4)}
      </Box>
      
      {renderSectionSkeleton("Staking Registry", 7)}
    </Paper>
  );

  if (loading) {
    return (
      <Box width="100%" maxWidth="1200px" p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Skeleton variant="circular" width={35} height={35} sx={{ mr: 1 }} />
              <Typography variant="h4" color="textPrimary">
                <Skeleton variant="text" width={250} />
              </Typography>
            </Box>
            <Skeleton variant="text" width={350} height={24} />
          </Box>
          <Skeleton variant="text" width={200} />
        </Box>
        
        {/* Show 3 skeleton contracts */}
        {[1, 2, 3].map((index) => renderContractSkeleton(index))}
      </Box>
    )
  }

  if (error) {
    return (
      <Box width="100%" maxWidth="1200px" p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
          <Box>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                whiteSpace: 'nowrap',
                mb: 1
              }}
            >
              <StorageIcon 
                sx={{ 
                  fontSize: '2.2rem',
                  color: theme.palette.primary.main,
                  mr: 1
                }} 
              />
              <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                Gateways
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              View contract states and configurations across the network
            </Typography>
          </Box>
        </Box>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'error.light'
          }}
        >
          <Typography color="error" variant="h6">Error Loading Gateway Data</Typography>
          <Typography color="error.dark" sx={{ mt: 1 }}>{error.message}</Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box width="100%" maxWidth="1200px" p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              whiteSpace: 'nowrap',
              mb: 1
            }}
          >
            <StorageIcon 
              sx={{ 
                fontSize: '2.2rem',
                color: theme.palette.primary.main,
                mr: 1
              }} 
            />
            <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
              Gateways
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            View contract states and configurations across the network
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Last Updated: {lastUpdated}
        </Typography>
      </Box>

      {details.map((detail, detailIndex) => (
        <Paper key={`contract-${detail.chainId}-${detailIndex}`} elevation={2} sx={{ mb: 4, p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            {detail.railsGateway?.chainImageUrl && (
              <img
                src={detail.railsGateway.chainImageUrl}
                alt={detail.railsGateway?.context?.chainName || 'Chain'}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
            )}
            <Typography variant="h5">
              {detail.railsGateway?.context?.chainLabel || 'Unknown Chain'}
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            Rails Gateway
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {railsGatewayFields.map((field: any, index: number ) => {
                  if (!detail.railsGateway) {
                    return null
                  }
                  const label = field.label
                  let value = detail.railsGateway[field.value]
                  const imageUrl = detail.railsGateway[field.imageUrl]

                  if (Array.isArray(field.value)) {
                    value = `${detail.railsGateway[field.value[0]]} (${detail.railsGateway[field.value[1]]})`
                  }

                  let link = detail.railsGateway[field.link]

                  if (field.value === 'pathIds') {
                    link = value.map((pathId: string) => `/p/${pathId}`)
                  }

                  if (field.value === 'eventNames') {
                    link = value.map((eventName: string) => `/events#${eventName}`)
                  }

                  const key = `key-${label}-${value}`

                  return (
                    <DetailRow
                      key={key}
                      loading={loading}
                      label={label}
                      value={value}
                      link={link}
                      imageUrl={imageUrl}
                    />
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Staking Registry
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {stakingRegistryFields.map((field: any, index: number) => {
                  const label = field.label
                  let value = detail.stakingRegistry[field.value]
                  const imageUrl = detail.stakingRegistry[field.imageUrl]

                  if (Array.isArray(field.value)) {
                    value = `${detail.stakingRegistry[field.value[0]]} (${detail.stakingRegistry[field.value[1]]})`
                  }

                  let link = detail.stakingRegistry[field.link]

                  if (field.value === 'pathIds') {
                    link = value.map((pathId: string) => `/p/${pathId}`)
                  }

                  if (field.value === 'eventNames') {
                    link = value.map((eventName: string) => `/events#${eventName}`)
                  }

                  const key = `key-${label}-${value}`

                  return (
                    <DetailRow
                    key={key}
                    loading={loading}
                    label={label}
                    value={value}
                    link={link}
                    imageUrl={imageUrl}
                  />
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Box>
  )
}
