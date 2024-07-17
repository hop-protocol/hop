'use client'
import React from 'react'
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
import { makeStyles } from '@mui/styles'
import { useTransferDetails } from '@/app/hooks/useTransferDetails'
import { CopyToClipboardText } from '@/app/components/CopyToClipboardText'

const useStyles = makeStyles((theme: any) => ({
  tableRow: {
    wordBreak: 'break-all',
    '& td:first-child': {
      [theme.breakpoints.down('md')]: {
        borderBottom: 'none',
        paddingBottom: 0,
      },
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex !important',
      flexDirection: 'column',
    }
  }
}))

export const DetailRow = ({ loading, label, value, link, imageUrl, skeletonWidth = 200, maxWidth }: any) => {
  const styles = useStyles()
  return (
    <TableRow className={styles.tableRow}>
      <TableCell style={{ minWidth: '350px' }}>{label}:</TableCell>
      <TableCell style={{ maxWidth }}>
        <Box display="flex" alignItems="center">
          {imageUrl && (
            <img src={imageUrl} alt="" style={{ width: 20, height: 20, marginRight: 8 }} />
          )}
          {loading ? (
            <Skeleton variant="rectangular" width={skeletonWidth} height={20} />
          ) : (
            link ? (
              <CopyToClipboardText text={value}>
                <Link href={link} target="_blank" rel="noreferrer">
                  {value}
                </Link>
              </CopyToClipboardText>
            ) : (typeof value === 'string' || typeof value === 'number') ? (
              <CopyToClipboardText text={value as string}>{value}</CopyToClipboardText>
            ) : (value ? value : '-')
          )}
        </Box>
      </TableCell>
    </TableRow>
  )
}
