import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import Link from '@mui/material/Link'
import React, { useState } from 'react'
import Skeleton from '@mui/material/Skeleton'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import _Table from '@mui/material/Table'
import { CopyToClipboard } from './CopyToClipboard'
import { makeStyles } from '@mui/styles'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

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
  imageUrl?: string
  clipboardValue?: string
  hoverTitle?: string
  button?: boolean
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
  minWidth?: string
}

export function Table (props: Props) {
  const { title, headers, rows, showNextButton, showPreviousButton, nextPage, previousPage, limit, loading = false, onRowClick, minWidth = '0px' } = props
  const styles = useStyles()
  const [copied, setCopied] = useState('')
  const [copiedKey, setCopiedKey] = useState('')
  const page = 0

  function handleCopy (value: string, key: string) {
    setCopied(value)
    setCopiedKey(key)
    setTimeout(() => {
      setCopied('')
      setCopiedKey('')
    }, 1000)
  }

  return (
    <Box>
      <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" className={styles.titleContainer}>
        <Typography variant="h4" color="textPrimary">{title}</Typography>
        {props.filters ? props.filters : null}
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between">
        <Box width="100%" mr={4}>
          <TableContainer>
            <_Table width="100%" style={{ minWidth }}>
              <TableHead>
                <TableRow>
                  {headers.filter(item => item.key !== 'subtable').map((header: Header, i: number) => {
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
                  return <>
                    <TableRow key={i}>
                      {row.filter(row => row.key !== 'subtable').map((col: Row, j: number) => {
                        const allowClick = onRowClick && !(col.valueUrl || col.clipboardValue)
                        const cellKey = `${i}${j}`
                        return (
                          <TableCell key={j} title={col.hoverTitle || col.clipboardValue || col.value}
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
                              <Box display="flex" alignItems="center">
                                {col.imageUrl && (
                                  <img src={col.imageUrl} alt="" style={{ width: 20, height: 20, marginRight: 8 }} />
                                )}
                                {col.valueUrl ? (
                                  col.button ? (
                                    <Button
                                      endIcon={<ArrowForwardIcon />}
                                      href={col.valueUrl}>{col.value}</Button>
                                  ) : (
                                  <Link href={col.valueUrl} target="_blank" rel="noreferrer">
                                    <Typography variant="body2">{col.value}</Typography>
                                  </Link>
                                  )
                                ) : (
                                  typeof col.value === 'string'
                                  ? <Typography variant="body2">{col.value}</Typography>
                                  : (col.value != null ? col.value : '-')
                                )}
                              </Box>
                              {col.clipboardValue != null && (
                                <Box ml={0.5}>
                                  <CopyToClipboard text={col.clipboardValue}
                                    onCopy={event => handleCopy(col.clipboardValue!, cellKey)}>
                                    <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                      {copiedKey === cellKey ? '✅' : '📋'}
                                    </Typography>
                                  </CopyToClipboard>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                        )
                      })}
                    </TableRow>

                    <TableRow>
                      {headers.filter(item => item.key === 'subtable').map((header: Header, i: number) => {
                        return (
                          <TableCell key={i} colSpan={headers.length} style={{ paddingLeft: '100px', paddingBottom: 0, borderBottom: 'none' }}>
                            <Typography variant="subtitle1" fontWeight="500">{header.value}</Typography>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                    {row.find(item => item.key === 'subtable')?.value && (
                      <TableRow>
                        <TableCell colSpan={headers.length} style={{ paddingLeft: '100px' }}>
                          <_Table>
                            <TableHead>
                              <TableRow>
                                {row.find(item => item.key === 'subtable')?.value.headers.map((header: Header, k: number) => (
                                  <TableCell key={k} >
                                    <Typography variant="body2" fontWeight="500">{header.value}</Typography>
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.find(item => item.key === 'subtable')?.value.rows.map((subRow: Row[], l: number) => (
                                <TableRow key={l}>
                                  {subRow.map((subCol: Row, m: number) => (
                                    <TableCell key={m}>
                                      <Typography variant="body2">{subCol.value}</Typography>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </_Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </>

                })}
              </TableBody>
            </_Table>
          </TableContainer>
        </Box>
      </Box>
      <_Table>
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
      </_Table>
    </Box>
  )
}
