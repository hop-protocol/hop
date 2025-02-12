'use client'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { DetailRow } from './DetailRow' // Adjust the import path as needed

export function ContractStates() {
  // Local state for our fetched data.
  const [contractState, setContractState] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    //fetch('http://localhost:8000/v1/contract-state')
    fetch('https://v2-explorer-api-sepolia.hop.exchange/v1/contract-state')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((json) => {
        console.log('json', json)
        // Assume the response is in the format:
        // { data: { chainId: { railsGateway: { ... }, stakingRegistry: { ... } } }, lastUpdated: '...' }
        const stateData = json.data
        // Transform the object into an array of records.
        const formattedData = Object.entries(stateData).map(([chainId, details]: any) => ({
          chainId,
          ...details,
        }))
        setContractState(formattedData)
        setLastUpdated(json.lastUpdated)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  // Define the fields (and labels) for each section.
  // For each field, if a block explorer link exists it is assumed to be stored
  // on the same object with the "ExplorerUrl" suffix.
  const railsGatewayFields = [
    { key: 'railsGatewayAddress', label: 'Gateway Address' },
    { key: 'removeFee', label: 'Remove Fee' },
    { key: 'updateFee', label: 'Update Fee' },
    { key: 'stakingRegistryAddress', label: 'Staking Registry Address' },
  ]

  const pathsFields = [
    { key: 'pathId', label: 'Path ID' },
    { key: 'headClaimId', label: 'Head Claim ID' },
    { key: 'pathVault', label: 'Path Vault' },
    { key: 'sendFee', label: 'Send Fee' },
    { key: 'messageFee', label: 'Message Fee' },
    { key: 'claimFeesFee', label: 'Claim Fees Fee' },
    { key: 'totalClaims', label: 'Total Claims' },
    { key: 'totalConfirmed', label: 'Total Confirmed' },
    { key: 'totalSent', label: 'Total Sent' },
  ]

  const stakingRegistryFields = [
    { key: 'stakingRegistryAddress', label: 'Registry Address' },
    { key: 'challengePeriod', label: 'Challenge Period' },
    { key: 'appealPeriod', label: 'Appeal Period' },
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
      {/* Header: Title on the left, Last Updated aligned right */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Contract States
        </Typography>
        <Typography variant="body2">
          Last Updated: {lastUpdated}
        </Typography>
      </Box>

      {contractState.map((contract) => (
        <Paper key={contract.chainId} elevation={2} sx={{ mb: 4, p: 2 }}>
          {/* Basic Contract Info */}
          <Typography variant="h5" gutterBottom>
            {contract.chainId} –{' '}
            {contract.railsGateway?.context?.chainLabel || 'Unknown Chain'}
          </Typography>

          {/* Rails Gateway Data */}
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
                  const link = contract.railsGateway
                    ? contract.railsGateway[field.key + 'ExplorerUrl'] || ''
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

          {/* Paths – nested data from railsGateway */}
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

          {/* Staking Registry Data */}
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
