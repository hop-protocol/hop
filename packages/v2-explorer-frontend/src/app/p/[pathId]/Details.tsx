'use client'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { DetailRow } from '@/app/contracts/DetailRow'

export function Details(props: any) {
  const { initialPathDetails } = props
  const [contractState, setContractState] = useState<any[]>(initialPathDetails?.items)
  const [lastUpdated, setLastUpdated] = useState<string>(initialPathDetails?.lastUpdated ?? '')
  const [loading, setLoading] = useState<boolean>(!contractState?.length)

  console.log('initialPathDetails', initialPathDetails)

  const pathsFields = [
    { key: 'chainId', label: 'Chain ID' },
    { key: 'pathId', label: 'Path ID' },
    { key: 'headClaimId', label: 'Head Claim ID' },
    { key: 'tokenVault', label: 'Token Vault' },
    { key: 'sendFee', label: 'Send Fee' },
    { key: 'totalClaims', label: 'Total Claims' },
    { key: 'totalConfirmed', label: 'Total Confirmed' },
    { key: 'totalSent', label: 'Total Sent' },
    { key: 'tokenLabel', label: 'Token Name' },
    { key: 'tokenAddress', label: 'Token Address' },
    { key: 'totalClaimsAtHeadClaimId', label: 'Total Claims at Head Claim ID' },
    { key: 'bucketIndex', label: 'Bucket Index' }
  ]

  if (loading) {
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box width="100%" maxWidth="1200px" p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Path Details
        </Typography>
        <Typography variant="body2">
          Last Updated: {lastUpdated}
        </Typography>
      </Box>

      {Object.values(contractState).map(
        (path: any, index: number) => (
          <Box key={index} sx={{ mb: 2, ml: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Path on {index === 1 ? 'Counterpart' : ''} Chain <strong>{path?.context?.chainName}</strong>
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  {pathsFields.map((field) => {
                    let rawValue = path[field.key] || ''
                    let displayValue = path[field.key + 'Display'] || ''
                    let link = path[field.key + 'ExplorerUrl'] || ''

                    if (field.key === 'tokenLabel') {
                      displayValue = path.token.name
                      link = ''
                      rawValue = path.token.symbol
                    }

                    if (field.key === 'tokenAddress') {
                      displayValue = path.token.address
                      link = path.token.tokenExplorerUrl
                      rawValue = path.token.address
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
          </Box>
        )
      )}
    </Box>
  )
}
