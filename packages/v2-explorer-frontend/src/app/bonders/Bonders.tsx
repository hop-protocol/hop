'use client'
import React, { useEffect, useState } from 'react'
import { apiUrl, networkSlug, appApiHost } from '@/app/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Link from '@mui/material/Link'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import Avatar from '@mui/material/Avatar'
import { CopyToClipboardText } from '@/app/components/CopyToClipboardText'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import { useTheme } from '@/app/hooks/useTheme'

export function Bonders() {
  const { theme, dark: isDarkMode } = useTheme()
  const [contractState, setContractState] = useState<any>({})
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const hostname = typeof window === 'undefined' ? appApiHost : window.location.host
    const protocol = hostname.includes('localhost') ? 'http' : 'https'

    const pathname = `/bonders`
    const url = `${protocol}://${hostname}/api/?pathname=${pathname}`
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((json) => {
        console.log('json', json)
        setContractState(json.data)
        setLastUpdated(json.lastUpdated)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  // Loading state with skeletons for better UX
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ mb: { xs: 3, sm: 5 } }}>
          <Skeleton variant="text" width="300px" height={60} />
          <Skeleton 
            variant="text" 
            width="100%" 
            height={30}
            sx={{ maxWidth: "500px" }}
          />
        </Box>
        
        {[1, 2].map((i) => (
          <Paper 
            key={i} 
            elevation={2} 
            sx={{ 
              mb: { xs: 3, sm: 4 }, 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Skeleton variant="rectangular" height={400} />
          </Paper>
        ))}
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box sx={{ mb: { xs: 3, sm: 5 } }}>
          <Typography variant="h3" component="h1" fontWeight="bold" color="primary" mb={1} 
            sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
            Bonders
          </Typography>
        </Box>
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'error.light'
          }}
        >
          <Typography color="error" variant="h6">Error Loading Bonder Data</Typography>
          <Typography color="error.dark" sx={{ mt: 1 }}>{error.message}</Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: { xs: 3, sm: 5 } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            gap: 1,
            whiteSpace: 'nowrap',
            mb: 1
          }}
        >
          <SupervisorAccountIcon 
            sx={{ 
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
              color: theme.palette.primary.main,
              mr: 1
            }} 
          />
          <Typography variant="h3" component="h1" fontWeight="bold" color="text.primary"
            sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
            Bonders
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          View active bonders and their balances across chains
        </Typography>
      </Box>

      {contractState.bonders?.map((bonder: any) => (
        <Paper 
          key={bonder.address} 
          elevation={isDarkMode ? 3 : 2} 
          sx={{ 
            mb: { xs: 3, sm: 5 }, 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
          }}
        >
          {/* Bonder Header */}
          <Box 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              background: isDarkMode 
                ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, rgba(25, 25, 35, 0.9) 100%)`
                : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(245,247,250,0.9) 100%)',
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
              <Avatar
                sx={{
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }}
              >
                <AccountBalanceWalletIcon />
              </Avatar>

              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  Bonder
                </Typography>
                <Box display="flex" alignItems="center" mt={0.5} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                  <CopyToClipboardText text={bonder.address}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        backgroundColor: isDarkMode 
                          ? 'rgba(0,0,0,0.2)' 
                          : 'rgba(0,0,0,0.05)',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                        maxWidth: { xs: '180px', sm: '220px', md: '100%' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: { xs: 'nowrap', md: 'initial' }
                      }}
                    >
                      {bonder.address}
                    </Typography>
                  </CopyToClipboardText>
                </Box>
              </Box>

              <Box flexGrow={1} />
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  alignSelf: 'flex-start',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Unknown'}
              </Typography>
            </Box>
            {/* Mobile-only timestamp */}
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 1,
                fontSize: '0.7rem',
                display: { xs: 'block', sm: 'none' }
              }}
            >
              Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Unknown'}
            </Typography>
          </Box>

          {/* Total Bonded By Token */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>
              Total Bonded by Token
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: { xs: 1, sm: 2 },
                mb: { xs: 3, sm: 4 }
              }}
            >
              {Object.entries(bonder.totalAmountBondedByToken).map(([symbol, data]: [string, any]) => (
                <Card 
                  key={symbol} 
                  elevation={1}
                  sx={{ 
                    minWidth: { xs: 'calc(50% - 8px)', sm: 220 },
                    flex: { xs: '1 0 calc(50% - 8px)', sm: '0 0 220px' },
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box display="flex" alignItems="center" mb={1.5}>
                      {data.token.imageUrl && (
                        <Avatar
                          src={data.token.imageUrl}
                          alt={symbol}
                          sx={{ width: { xs: 24, sm: 32 }, height: { xs: 24, sm: 32 }, mr: 1 }}
                        >
                          {symbol.charAt(0)}
                        </Avatar>
                      )}
                      <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{symbol}</Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 1.5 }} />
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Bonded
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        {data.amountDisplay}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="primary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        {data.amountUsdDisplay}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Chain Balances */}
            <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>
              Chain Balances
            </Typography>
            
            <TableContainer 
              component={Paper} 
              elevation={0} 
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                overflowX: 'auto'
              }}
            >
              <Table 
                sx={{ 
                  minWidth: { xs: 450, sm: 650 },
                  tableLayout: { xs: 'fixed', md: 'auto' }
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: isDarkMode 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.02)',
                      '& th': {
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        px: { xs: 1, sm: 2 },
                        py: { xs: 1.5, sm: 2 }
                      }
                    }}
                  >
                    <TableCell sx={{ width: { xs: '25%', sm: 'auto' } }}>Chain</TableCell>
                    <TableCell sx={{ width: { xs: '25%', sm: 'auto' } }}>Staked Balance</TableCell>
                    <TableCell sx={{ width: { xs: '25%', sm: 'auto' } }}>Withdrawable Balance</TableCell>
                    <TableCell sx={{ width: { xs: '25%', sm: 'auto' } }}>HOP Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bonder.balances.map((balance: any) => (
                    <TableRow 
                      key={balance.chainId}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': {
                          backgroundColor: isDarkMode 
                            ? 'rgba(255,255,255,0.03)' 
                            : 'rgba(0,0,0,0.01)'
                        },
                        '& td': {
                          px: { xs: 1, sm: 2 },
                          py: { xs: 1.5, sm: 2 }
                        }
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {balance.chainImageUrl && (
                            <Avatar
                              src={balance.chainImageUrl}
                              alt={balance.chainName}
                              sx={{ width: { xs: 18, sm: 24 }, height: { xs: 18, sm: 24 }, mr: 1 }}
                            >
                              {balance.chainLabel.charAt(0)}
                            </Avatar>
                          )}
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            {balance.chainLabel}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              wordBreak: 'break-word'
                            }}
                          >
                            {balance.stakedBalanceDisplay}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="primary"
                            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                          >
                            {balance.stakedBalanceUsdDisplay}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              wordBreak: 'break-word'
                            }}
                          >
                            {balance.withdrawableBalanceDisplay}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="primary"
                            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                          >
                            {balance.withdrawableBalanceUsdDisplay}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              wordBreak: 'break-word'
                            }}
                          >
                            {balance.hopBalanceDisplay}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="primary"
                            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                          >
                            {balance.hopBalanceUsdDisplay}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      ))}
    </Container>
  )
}
