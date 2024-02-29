import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import _Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import Skeleton from '@mui/material/Skeleton'
import Link from '@mui/material/Link'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: any) => ({
  titleContainer: {
    '& > div': {
      [theme.breakpoints.down('md')]: {
        display: 'flex',
        marginTop: '1rem',
        flexDirection: 'column'
      }
    },
    '& > div > div': {
      [theme.breakpoints.down('md')]: {
        marginTop: '0.5rem'
      }
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  }
}))

export type Header = {
  key: string
  value: string
}

export type Row = {
  key: string
  value: string | any
  valueUrl?: string
  clipboardValue?: string
  title?: string
}

type Props = {
  title: string
  headers: Header[]
  rows: Row[][]
  showNextButton: boolean
  showPreviousButton: boolean
  nextPage: any
  previousPage: any
  limit: number
  loading?: boolean
  onRowClick?: any
  filters?: any
}

export function Table (props: Props) {
  const { title, headers, rows, showNextButton, showPreviousButton, nextPage, previousPage, limit, loading = false, onRowClick } = props
  const styles = useStyles()
  const [copied, setCopied] = useState('')
  const page = 0

  function handleChangePage() {
  }

  function handleChangeRowsPerPage () {
  }

  function handleCopy (value: string) {
    setCopied(value)
    setTimeout(() => {
      setCopied('')
    }, 1000)
  }

  return (
    <Box>
      <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" className={styles.titleContainer}>
        <Typography variant="h5">{title}</Typography>
        {props.filters ? props.filters : null}
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between">
        <Box width="100%" mr={4}>
          <TableContainer>
            <_Table width="100%">
              <TableHead>
                <TableRow>
                  {headers.map((header: Header, i: number) => {
                    return (
                      <TableCell key={i}>{header.value}</TableCell>
                    )
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {(!loading && !rows.length) && (
                  <TableRow>
                    <TableCell colSpan={headers.length}>
                      <Typography variant="body2"><em>No events found</em></Typography>
                    </TableCell>
                  </TableRow>
                )}
                {loading && (
                  <>
                    <TableRow>
                      <TableCell colSpan={headers.length}>
                        <Skeleton variant="rectangular" width={'100%'} height={20} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={headers.length}>
                        <Skeleton variant="rectangular" width={'100%'} height={20} />
                      </TableCell>
                    </TableRow>
                  </>
                )}
                {rows.map((row: Row[], i: number) => {
                  return (
                    <TableRow key={i}>
                      {row.map((col: Row, j: number) => {
                        const allowClick = onRowClick && !(col.valueUrl || col.clipboardValue)
                        return (
                          <TableCell key={j} title={col.title || col.clipboardValue || col.value}
                            style={{
                              cursor: allowClick ? 'pointer' : 'default'
                            }}
                            onClick={(event) => {
                              if (allowClick) {
                                onRowClick(row)
                              }
                            }}
                          >
                            <Box display="flex" alignItems="center">
                              <Box>
                                {col.valueUrl ? (
                                  <Link href={col.valueUrl} target="_blank" rel="noreferrer">
                                    <Typography variant="body2">{col.value}</Typography>
                                  </Link>
                                ) : (
                                  typeof col.value === 'string'
                                  ? <Typography variant="body2">{col.value}</Typography>
                                  : (col.value != null ? col.value : '-')
                                )}
                              </Box>
                              {col.clipboardValue != null && (
                                <Box ml={0.5}>
                                  <CopyToClipboard text={col.clipboardValue}
                                    onCopy={event => handleCopy(col.clipboardValue!)}>
                                    <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                      {copied === col.clipboardValue ? '✅' : '📋'}
                                    </Typography>
                                  </CopyToClipboard>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </_Table>
          </TableContainer>
        </Box>
      </Box>
      <TableFooter style={{ display: 'flex', width: '100%' }}>
        <TableRow style={{ display: 'flex', width: '100%' }}>
          <TableCell colSpan={headers.length} style={{ display: 'flex', width: '100%' }}>
            <Box width="100%" display="flex" justifyContent="flex-end">
                <IconButton
                  onClick={previousPage}
                  disabled={!showPreviousButton}
                  aria-label="previous page"
                >
                <KeyboardArrowLeft />
              </IconButton>
                <IconButton
                  onClick={nextPage}
                  disabled={!showNextButton}
                  aria-label="next page"
                >
                <KeyboardArrowRight />
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Box>
  )
}
