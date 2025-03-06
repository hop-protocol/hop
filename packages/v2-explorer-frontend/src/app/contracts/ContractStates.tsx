'use client'
import React, { useEffect, useState } from 'react'
import { apiUrl, networkSlug, appApiHost } from '@/app/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { DetailRow } from './DetailRow'

export function ContractStates() {
  const [contractState, setContractState] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

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

  if (loading) {
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    )
  }

  return (
    <Box width="100%" maxWidth="1200px" p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Contract States
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Last Updated: {lastUpdated}
        </Typography>
      </Box>

      {contractState.map((contract) => (
        <Paper key={contract.chainId} elevation={2} sx={{ mb: 4, p: 2 }}>
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
                      key={field.key}
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
                (path: any, index: number) => (
                  <Box key={index} sx={{ mb: 2, ml: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Path {index + 1}
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
                                key={field.key}
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
                      key={field.key}
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
