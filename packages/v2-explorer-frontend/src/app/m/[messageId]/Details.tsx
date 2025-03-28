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
import { DetailRow } from '@/app/gateways/DetailRow'

export function Details(props: any) {
  const { initialMessageDetails } = props
  const [details, setDetails] = useState<any>(initialMessageDetails?.data)
  const [lastUpdated, setLastUpdated] = useState<string>(initialMessageDetails?.lastUpdated ?? '')
  const [loading, setLoading] = useState<boolean>(!details?.messageId)

  console.log('initialMessageDetails', initialMessageDetails)

  const fields = [
    { key: 'messageId', label: 'Message ID' },
    { key: 'fromChainId', label: 'From Chain ID' },
    { key: 'toChainId', label: 'To Chain ID' },
    { key: 'fromAddress', label: 'From Address' },
    { key: 'toAddress', label: 'To Address' },
    { key: 'data', label: 'Data' },
    { key: 'bundleId', label: 'Bundle ID' },
    { key: 'treeIndex', label: 'Tree Index' },
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
        <Typography variant="h4" color="textPrimary">
          Message Details
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Last Updated: {lastUpdated}
        </Typography>
      </Box>

          <Box sx={{ mb: 2, ml: 2 }}>
            <Typography variant="subtitle1" gutterBottom color="textPrimary">
              Message
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  {fields.map((field) => {
                    let rawValue = details[field.key] || ''
                    let displayValue = details[field.key + 'Display'] || ''
                    let link = details[field.key + 'ExplorerUrl'] || ''

                    if (field.key === 'fromChainId' ) {
                      rawValue = details.fromChainLabel
                      displayValue = details.fromChainLabel
                    }

                    if (field.key === 'toChainId') {
                      rawValue = details.toChainLabel
                      displayValue = details.toChainLabel
                    }
                    
                    return (
                      <DetailRow
                        key={field.key}
                        label={field.label}
                        rawValue={rawValue}
                        displayValue={displayValue}
                        link={link}
                        loading={loading}
                        maxWidth={600}
                      />
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
    </Box>
  )
}
