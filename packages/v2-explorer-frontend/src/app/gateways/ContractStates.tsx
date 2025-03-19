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
import { DetailRow } from './DetailRow'
import StorageIcon from '@mui/icons-material/Storage'

export function ContractStates() {
  const [contractState, setContractState] = useState<any[]>([])
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
        setContractState(Object.values(json.data))
        setLastUpdated(json.lastUpdated)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  const railsGatewayFields = [
    { key: 'railsGatewayAddress', label: 'Gateway Address' },
    { key: 'removeFee', label: 'Remove Fee' },
    { key: 'pushClaimFee', label: 'Push Claim Fee' },
    { key: 'stakingRegistryAddress', label: 'Staking Registry Address' },
    { key: 'pathIds', label: 'Path Ids' },
  ]

  const pathsFields = [
    { key: 'pathId', label: 'Path ID' },
    { key: 'headClaimId', label: 'Head Claim ID' },
    { key: 'pathVault', label: 'Path Vault' },
    { key: 'sendFee', label: 'Send Fee' },
    { key: 'hardConfirmedClaimId', label: 'Hard Confirmed Claim ID' },
    { key: 'hardConfirmedBucketIndex', label: 'Hard Confirmed Bucket Index' },
    { key: 'totalClaims', label: 'Total Claims' },
    { key: 'totalConfirmed', label: 'Total Confirmed' },
    { key: 'totalSent', label: 'Total Sent' },
  ]

  const stakingRegistryFields = [
    { key: 'stakingRegistryAddress', label: 'Registry Address' },
    { key: 'challengePeriod', label: 'Challenge Period (Seconds)' },
    { key: 'appealPeriod', label: 'Appeal Period (Seconds)' },
    { key: 'minChallengeIncrease', label: 'Min Challenge Increase' },
    { key: 'fullAppeal', label: 'Full Appeal' },
    { key: 'minHopStake', label: 'Min Hop Stake' },
    { key: 'hopToken', label: 'Hop Token' },
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

      {contractState.map((contract, contractIndex) => (
        <Paper key={`contract-${contract.chainId}-${contractIndex}`} elevation={2} sx={{ mb: 4, p: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            {contract.railsGateway?.chainImageUrl && (
              <img
                src={contract.railsGateway.chainImageUrl}
                alt={contract.railsGateway?.context?.chainName || 'Chain'}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
            )}
            <Typography variant="h5">
              {contract.railsGateway?.context?.chainLabel || 'Unknown Chain'}
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            Rails Gateway
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {railsGatewayFields.map((field) => {
                  const rawValue = contract.railsGateway
                    ? contract.railsGateway[field.key] || ''
                    : ''
                  const displayValue = contract.railsGateway
                    ? contract.railsGateway[field.key + 'Display'] || ''
                    : ''
                  let link = contract.railsGateway
                    ? contract.railsGateway[field.key + 'ExplorerUrl'] || ''
                    : ''

                  if (field.key === 'pathIds') {
                    link = rawValue.map((pathId: string) => `/p/${pathId}`)
                  }

                  return (
                    <DetailRow
                      key={`rails-${contract.chainId}-${field.key}`}
                      label={field.label}
                      rawValue={rawValue}
                      displayValue={displayValue}
                      link={link}
                      loading={loading}
                    />
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {contract.railsGateway?.paths && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Paths
              </Typography>
              {Object.values(contract.railsGateway.paths).map(
                (path: any, pathIndex: number) => (
                  <Box key={`path-${contract.chainId}-${pathIndex}`} sx={{ mb: 2, ml: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Path {pathIndex + 1}
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableBody>
                          {pathsFields.map((field) => {
                            const rawValue = path[field.key] || ''
                            const displayValue = path[field.key + 'Display'] || ''
                            const link = path[field.key + 'ExplorerUrl'] || ''

                            return (
                              <DetailRow
                                key={`path-${contract.chainId}-${pathIndex}-${field.key}`}
                                label={field.label}
                                rawValue={rawValue}
                                displayValue={displayValue}
                                link={link}
                                loading={loading}
                              />
                            )
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )
              )}
            </>
          )}

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Staking Registry
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {stakingRegistryFields.map((field) => {
                  const rawValue = contract.stakingRegistry
                    ? contract.stakingRegistry[field.key] || ''
                    : ''
                  const displayValue = contract.stakingRegistry
                    ? contract.stakingRegistry[field.key + 'Display'] || ''
                    : ''
                  const link = contract.stakingRegistry
                    ? contract.stakingRegistry[field.key + 'ExplorerUrl'] || ''
                    : ''
                  return (
                    <DetailRow
                      key={`registry-${contract.chainId}-${field.key}`}
                      label={field.label}
                      rawValue={rawValue}
                      displayValue={displayValue}
                      link={link}
                      loading={loading}
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
