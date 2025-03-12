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
    },
  },
}))

// The DetailRow component computes the text to display as follows:
// - If a display value exists and is different from the raw value,
//     it shows: "displayValue (rawValue)"
// - Otherwise, it shows just the raw value.
// If a link (such as a block explorer URL) is provided, the text is wrapped in a clickable link.
export const DetailRow = ({
  loading,
  label,
  rawValue,
  displayValue,
  link,
  imageUrl,
  skeletonWidth = 200,
  maxWidth,
}: {
  loading: boolean
  label: string
  rawValue: string | string[]
  displayValue?: string
  link?: string | string[]
  imageUrl?: string
  skeletonWidth?: number
  maxWidth?: number | string
}) => {
  const styles = useStyles()
  let computedValue: any =
    displayValue && displayValue !== rawValue
      ? `${rawValue} (${displayValue})`
      : rawValue

  if (rawValue && Array.isArray(rawValue)) {
    computedValue = <Box>
      <ul>
        {rawValue.map((value: string, i: number) => {
          return (
            <li key={i}>
              <Link href={link?.[i]} target="_blank" rel="noreferrer">
                {value}
              </Link>
            </li>
          )
        })}
      </ul>
    </Box>

    label = `${label} (${rawValue.length})`
  }

  return (
    <TableRow className={styles.tableRow}>
      <TableCell style={{ minWidth: '350px' }}>{label ? `${label}:` : ''}</TableCell>
      <TableCell style={{ maxWidth }}>
        <Box display="flex" alignItems="center">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={label}
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
          )}
          {loading ? (
            <Skeleton variant="rectangular" width={skeletonWidth} height={20} />
          ) : (link && !Array.isArray(link) && computedValue && !Array.isArray(computedValue)) ? (
            <CopyToClipboardText text={rawValue?.toString()}>
              <Link href={link} target="_blank" rel="noreferrer">
                {computedValue}
              </Link>
            </CopyToClipboardText>
          ) : (typeof computedValue === 'string' ||
              typeof computedValue === 'number') &&
            computedValue?.toString().trim() !== '' ? (
            <CopyToClipboardText text={rawValue?.toString()}>
              {computedValue}
            </CopyToClipboardText>
          ) : (
            computedValue ? computedValue : '-'
          )}
        </Box>
      </TableCell>
    </TableRow>
  )
}
