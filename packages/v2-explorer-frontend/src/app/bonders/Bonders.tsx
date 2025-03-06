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
import { CopyToClipboardText } from '@/app/components/CopyToClipboardText'
import { DetailRow } from '@/app/contracts/DetailRow'

export function Bonders() {
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

  if (loading) {
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    )
  }

  return (
    <Box width="100%" maxWidth="1400px" p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Bonders
        </Typography>
        {lastUpdated && (
          <Typography variant="body2" color="textSecondary">
            Last Updated: {lastUpdated}
          </Typography>
        )}
      </Box>

      {contractState.bonders?.map((bonder: any) => (
        <Paper key={bonder.address} elevation={2} sx={{ mb: 4, p: 2, background: '#fff' }}>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ width: '200px' }}>Bonder Address:</TableCell>
                  <TableCell>
                    <CopyToClipboardText text={bonder.address}>
                      {bonder.address}
                    </CopyToClipboardText>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '200px' }}>Token</TableCell>
                  <TableCell>Total Bonded Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(bonder.totalAmountBondedByToken).map(([symbol, data]: [string, any]) => (
                  <TableRow key={symbol}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {data.token.imageUrl && (
                          <img
                            src={data.token.imageUrl}
                            alt={symbol}
                            style={{ width: 20, height: 20, marginRight: 8 }}
                          />
                        )}
                        {symbol}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <CopyToClipboardText text={data.amount}>
                        {`${data.amount} (${data.amountDisplay}) (${data.amountUsdDisplay})`}
                      </CopyToClipboardText>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '200px' }}>Chain</TableCell>
                  <TableCell>Staked Balance</TableCell>
                  <TableCell>Withdrawable Balance</TableCell>
                  <TableCell>HOP Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bonder.balances.map((balance: any) => (
                  <TableRow key={balance.chainId}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {balance.chainImageUrl && (
                          <img
                            src={balance.chainImageUrl}
                            alt={balance.chainName}
                            style={{ width: 20, height: 20, marginRight: 8 }}
                          />
                        )}
                        {balance.chainLabel}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <CopyToClipboardText text={balance.stakedBalance}>
                        {`${balance.stakedBalance} (${balance.stakedBalanceDisplay}) (${balance.stakedBalanceUsdDisplay})`}
                      </CopyToClipboardText>
                    </TableCell>
                    <TableCell>
                      <CopyToClipboardText text={balance.withdrawableBalance}>
                        {`${balance.withdrawableBalance} (${balance.withdrawableBalanceDisplay}) (${balance.withdrawableBalanceUsdDisplay})`}
                      </CopyToClipboardText>
                    </TableCell>
                    <TableCell>
                      <CopyToClipboardText text={balance.hopBalance}>
                        {`${balance.hopBalance} (${balance.hopBalanceDisplay}) (${balance.hopBalanceUsdDisplay})`}
                      </CopyToClipboardText>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Box>
  )
}
