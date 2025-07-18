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
import { DetailRow } from '@/app/t/[transferId]/DetailRow'

export function Details(props: any) {
  const { initialPathDetails } = props
  const [contractState, setContractState] = useState<any[]>(initialPathDetails?.items)
  const [lastUpdated, setLastUpdated] = useState<string>(initialPathDetails?.lastUpdated ?? '')
  const [loading, setLoading] = useState<boolean>(!contractState?.length)

  console.log('initialPathDetails', initialPathDetails)

  const pathsFields = [
    { value: 'chainLabel', label: 'Chain ID', imageUrl: 'chainImageUrl' },
    { value: 'pathId', label: 'Path ID' },
    { value: 'pathAddress', label: 'Path Address', link: 'pathAddressExplorerUrl' },
    { value: 'initialId', label: 'Initial ID' },
    { value: ['initialReserve', 'initialReserveDisplay'], label: 'Initial Reserve' },
    { value: ['sendFee', 'sendFeeDisplay'], label: 'Send Fee' },
    { value: 'headClaimId', label: 'Head Claim ID' },
    { value: 'headTransferId', label: 'Head Transfer ID' },
    { value: 'bucketIndex', label: 'Bucket Index' },
    { value: ['totalConfirmed', 'totalConfirmedDisplay'], label: 'Total Confirmed' },
    { value: ['totalSent', 'totalSentDisplay'], label: 'Total Sent' },
    { value: ['totalClaimsAtHeadClaimId', 'totalClaimsAtHeadClaimIdDisplay'], label: 'Total Claims at Head Claim ID' },
    { value: 'hardConfirmedClaimId', label: 'Hard Confirmed Claim ID' },
    { value: 'hardConfirmedBucketIndex', label: 'Hard Confirmed Bucket Index' },
    { value: 'counterpartChainLabel', label: 'Counterpart Chain ID', imageUrl: 'counterpartChainImageUrl' },
    { value: 'tokenAddress', label: 'Token Address', link: 'tokenAddressExplorerUrl', imageUrl: 'tokenImageUrl' },
    { value: 'counterpartTokenAddress', label: 'Counterpart Token Address', link: 'counterpartTokenAddressExplorerUrl', imageUrl: 'counterpartTokenImageUrl' },
  ]

  if (loading) {
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box width="100%" maxWidth="1200px" p={2} mb={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" color="textPrimary">
          Path Details
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Last Updated: {lastUpdated}
        </Typography>
      </Box>

      {Object.values(contractState).map(
        (path: any, index: number) => (
          <Box key={index} sx={{ mb: 4, ml: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
              {path?.context?.chainImageUrl && (
                <img
                  src={path?.context?.chainImageUrl}
                  alt={path?.context?.chainName || 'Chain'}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
              )}
              <Typography variant="h5" color="textPrimary">
                Path on {index === 1 ? 'Counterpart' : ''} Chain <strong>{path?.context?.chainName}</strong>
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableBody>
                  {pathsFields.map((field: any) => {
                    const label = field.label
                    let value = path[field.value]
                    const imageUrl = path[field.imageUrl]

                    if (Array.isArray(field.value)) {
                      value = `${path[field.value[0]]} (${path[field.value[1]]})`
                    }

                    let link = path[field.link]

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
          </Box>
        )
      )}
    </Box>
  )
}
