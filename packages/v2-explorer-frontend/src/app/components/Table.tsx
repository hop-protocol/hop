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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

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
  title: string | JSX.Element
  headers: Header[]
  rows: Row[][]
  showNextButton: boolean
  showPreviousButton: boolean
  nextPage: any
  previousPage: any
  limit?: number
  defaultLimit?: number
  onPageLimitChange?: (newLimit: number) => void
  loading?: boolean
  onRowClick?: any
  filters?: any
  minWidth?: string
  titleVariant?: string
}

export function Table (props: Props) {
  const { 
    title, 
    headers, 
    rows, 
    showNextButton, 
    showPreviousButton, 
    nextPage, 
    previousPage, 
    limit = 10,
    defaultLimit = 10,
    onPageLimitChange,
    loading = false, 
    onRowClick, 
    minWidth = '0px', 
    titleVariant = 'h4' 
  } = props

  const theme = useTheme()
  const [copied, setCopied] = useState('')
  const [copiedKey, setCopiedKey] = useState('')
  const [pageLimit, setPageLimit] = useState(defaultLimit)

  const handleLimitChange = (event: any) => {
    const newLimit = event.target.value
    setPageLimit(newLimit)
    if (onPageLimitChange) {
      onPageLimitChange(newLimit)
    }
  }

  function handleCopy (value: string, key: string) {
    setCopied(value)
    setCopiedKey(key)
    setTimeout(() => {
      setCopied('')
      setCopiedKey('')
    }, 1000)
  }

  // Generate random width for skeleton cells
  const getRandomWidth = () => {
    return `${Math.floor(Math.random() * 30) + 70}%`;
  }

  // Function to render skeleton rows
  const renderSkeletonRows = () => {
    // Number of skeleton rows to show
    const skeletonRowCount = 5;
    const skeletonRows = [];
    
    for (let i = 0; i < skeletonRowCount; i++) {
      skeletonRows.push(
        <TableRow key={`skeleton-row-${i}`}>
          {headers.filter(item => item.key !== 'subtable').map((header, index) => {
            // Different skeleton types based on likely content
            if (header.key === 'status') {
              return (
                <TableCell key={`skeleton-cell-${index}`}>
                  <Skeleton 
                    variant="rounded" 
                    width={80} 
                    height={32} 
                    sx={{ borderRadius: 4 }} 
                  />
                </TableCell>
              );
            } else if (header.key === 'index' || header.key === 'created') {
              return (
                <TableCell key={`skeleton-cell-${index}`}>
                  <Skeleton variant="text" width={50} />
                </TableCell>
              );
            } else if (header.key === 'details') {
              return (
                <TableCell key={`skeleton-cell-${index}`}>
                  <Skeleton 
                    variant="rounded" 
                    width={60} 
                    height={32} 
                  />
                </TableCell>
              );
            } else {
              return (
                <TableCell key={`skeleton-cell-${index}`}>
                  <Skeleton variant="text" width={getRandomWidth()} />
                </TableCell>
              );
            }
          })}
        </TableRow>
      );
    }
    
    return skeletonRows;
  };

  return (
    <Box>
      <Box 
        mb={2} 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between" 
        sx={{
          '& > div': {
            [theme.breakpoints.down('md')]: {
              display: 'flex',
              marginTop: '1rem',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }
          },
          '& > div > div': {
            [theme.breakpoints.down('md')]: {
              marginTop: '0.5rem'
            }
          },
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            alignItems: 'flex-start'
          }
        }}
      >
        <Typography variant={titleVariant as any} color="textPrimary">{title}</Typography>
        {props.filters ? props.filters : null}
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between">
        <Box width="100%" mr={4} overflow="auto">
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
                {loading && renderSkeletonRows()}
                {!loading && rows.map((row: Row[], i: number) => {
                  return <React.Fragment key={i}>
                    <TableRow key={i}>
                      {row.filter(row => row.key !== 'subtable').map((col: Row, j: number) => {
                        const allowClick = !!onRowClick
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
                                  <img src={col.imageUrl} alt="" style={{ width: 20, height: 20, marginRight: 8 }} onError={(event: any) => event.target.style.display = 'none'} />
                                )}
                                {col.valueUrl ? (
                                  col.button ? (
                                    <Button
                                      endIcon={<ArrowForwardIcon />}
                                      href={col.valueUrl}
                                      onClick={(event) => event.stopPropagation()} // Prevent row click
                                      >{col.value}</Button>
                                  ) : (
                                  <Link
                                    href={col.valueUrl}
                                    target={col.valueUrl?.startsWith('/') ? '_self' : '_blank'}
                                    rel="noreferrer"
                                    onClick={(event) => event.stopPropagation()} // Prevent row click
                                  >
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
                                    onCopy={event => {
                                      handleCopy(col.clipboardValue!, cellKey)
                                    }}>
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
                                  {subRow.map((subCol: Row, m: number) => {
                                    const cellKey = `${subCol.value}-${m}`
                                    return (
                                      <TableCell key={m}>
                                        <Box display="flex" alignItems="center">
                                          {subCol.valueUrl ? (
                                            subCol.button ? (
                                              <Button
                                                endIcon={<ArrowForwardIcon />}
                                                href={subCol.valueUrl}>{subCol.value}</Button>
                                            ) : (
                                            <Link href={subCol.valueUrl} target="_blank" rel="noreferrer">
                                              <Typography variant="body2">{subCol.value}</Typography>
                                            </Link>
                                            )
                                          ) : (
                                            typeof subCol.value === 'string'
                                            ? <Typography variant="body2">{subCol.value}</Typography>
                                            : (subCol.value != null ? subCol.value : '-')
                                          )}
                                          {subCol.clipboardValue != null && (
                                            <Box ml={0.5}>
                                              <CopyToClipboard text={subCol.clipboardValue}
                                                onCopy={event => handleCopy(subCol.clipboardValue!, cellKey)}>
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
                              ))}
                            </TableBody>
                          </_Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                })}
              </TableBody>
            </_Table>
          </TableContainer>

          <Box sx={{ mt: 2, mb: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" color="textSecondary">
                  Showing {rows.length} items
                </Typography>
                {limit && onPageLimitChange && (
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="page-limit-select-label">Items per page</InputLabel>
                    <Select
                      labelId="page-limit-select-label"
                      id="page-limit-select"
                      value={limit}
                      onChange={handleLimitChange}
                      label="Items per page"
                    >
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>
              <Box>
                {(showPreviousButton || showNextButton) && (
                  <Box display="flex" gap={1}>
                    <IconButton
                      onClick={previousPage}
                      disabled={!showPreviousButton}
                      size="small"
                      title="Previous page"
                      sx={{
                        color: theme.palette.text.secondary,
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                        '&.Mui-disabled': {
                          opacity: 0.3,
                          backgroundColor: 'transparent',
                          border: `1px solid ${theme.palette.divider}`
                        }
                      }}
                    >
                      <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                      onClick={nextPage}
                      disabled={!showNextButton}
                      size="small"
                      title="Next page"
                      sx={{
                        color: theme.palette.text.secondary,
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                        '&.Mui-disabled': {
                          opacity: 0.3,
                          backgroundColor: 'transparent',
                          border: `1px solid ${theme.palette.divider}`
                        }
                      }}
                    >
                      <KeyboardArrowRight />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
