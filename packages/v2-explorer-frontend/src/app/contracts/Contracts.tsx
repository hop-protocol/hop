'use client'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Table } from '@/app/components/Table'

export function ContractsState() {
  // State for the fetched contract state data, loading and error.
  const [contractState, setContractState] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/v1/contract-state')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then(json => {
        console.log('json', json)
        // Assume the response is in the format { data: { ... } }
        const stateData = json.data
        // Convert the object into an array of entries that include the chain ID.
        const formattedData = Object.entries(stateData).map(([chainId, details]) => ({
          chainId,
          ...details
        }))
        setContractState(formattedData)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  // Define the headers for the table.
  // Adjust the fields below as needed.
  const headers = [
    { key: 'chainId', value: 'Chain ID' },
    { key: 'railsGatewayContractAddress', value: 'Rails Gateway Contract Address' },
    { key: 'removeFee', value: 'Remove Fee' },
    { key: 'updateFee', value: 'Update Fee' },
    { key: 'stakingRegistryAddress', value: 'Staking Registry Address' },
    { key: 'headClaimId', value: 'Head Claim ID' },
    { key: 'pathVault', value: 'Path Vault' },
    { key: 'sendFee', value: 'Send Fee' },
    { key: 'messageFee', value: 'Message Fee' },
    { key: 'claimFeesFee', value: 'Claim Fees Fee' },
    { key: 'totalClaims', value: 'Total Claims' },
    { key: 'totalConfirmed', value: 'Total Confirmed' },
    { key: 'totalSent', value: 'Total Sent' }
  ]

  // Build rows based on the headers.
  // Each row is an array of objects with keys: key, value and clipboardValue.
  const rows = contractState.map(item =>
    headers.map(header => ({
      key: header.key,
      value: item[header.key],
      clipboardValue: item[header.key]
    }))
  )

  return (
    <Box width="100%" maxWidth="1200px">
      {error && (
        <Typography color="error" variant="body1">
          Error: {error.message}
        </Typography>
      )}
      <Table
        title="Contract State"
        headers={headers}
        rows={rows}
        loading={loading}
        // No pagination is needed for this endpoint.
        showNextButton={false}
        showPreviousButton={false}
      />
    </Box>
  )
}
