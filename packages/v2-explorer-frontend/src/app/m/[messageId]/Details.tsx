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
  const { initialMessageDetails } = props
  const [details, setDetails] = useState<any>(initialMessageDetails?.data)
  const [lastUpdated, setLastUpdated] = useState<string>(initialMessageDetails?.lastUpdated ?? '')
  const [loading, setLoading] = useState<boolean>(!details?.messageId)

  console.log('initialMessageDetails', initialMessageDetails)

  const fields = [
    { value: 'messageId', label: 'Message ID' },
    { value: 'fromChainLabel', label: 'From Chain ID', imageUrl: 'fromChainImageUrl' },
    { value: 'toChainLabel', label: 'To Chain ID', imageUrl: 'toChainImageUrl' },
    { value: 'fromAddress', label: 'From Address', link: 'fromAddressExplorerUrl' },
    { value: 'toAddress', label: 'To Address', link: 'toAddressExplorerUrl' },
    { value: 'data', label: 'Data' },
    { value: 'bundleId', label: 'Bundle ID' },
    { value: 'treeIndex', label: 'Tree Index' },
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
            <TableContainer>
              <Table>
                <TableBody>
                  {fields.map((field: any) => {
                    const label = field.label
                    let value = details[field.value]
                    const imageUrl = details[field.imageUrl]
  
                    if (Array.isArray(field.value)) {
                      value = `${details[field.value[0]]} (${details[field.value[1]]})`
                    }
  
                    let link = details[field.link]
  
                    const key = `key-${label}-${value}`
  
                    return (
                      <DetailRow
                        key={key}
                        loading={loading}
                        label={label}
                        value={value}
                        link={link}
                        imageUrl={imageUrl}
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
