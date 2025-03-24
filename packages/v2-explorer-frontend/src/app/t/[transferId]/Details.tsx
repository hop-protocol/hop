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
import { DecodedSendDataTable } from '@/app/components/DecodedData/DecodedSendDataTable'
import { DecodedBondDataTable } from '@/app/components/DecodedData/DecodedBondDataTable'
import { DetailRow } from './DetailRow'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useRouter } from 'next/navigation'
import { useTheme } from '@mui/material/styles'

export function Details(props: any) {
  const { initialEventDetails } = props
  const theme = useTheme()
  console.log('initialEventDetails:', initialEventDetails)
  const {
    transferId,
    statusDisplay,
    transferRecipient,
    transferRecipientExplorerUrl,
    pathId,
    hops,
    sourceTx,
    destinationChainDisplay,
    destinationChainImageUrl,
    loading,
    transferAmountDisplay,
    sourcePoolDisplay,
    sourceTokenAddress,
    sourceTokenDisplay,
    sourceTokenExplorerUrl,
    sourceTokenImageUrl,
    destinationTxs
  } = useTransferDetails({ initialEventDetails })
  const router = useRouter()
  
  // Format the lastUpdated date if available - access from initialEventDetails directly
  const formattedLastUpdated = initialEventDetails?.lastUpdated ? 
    new Date(initialEventDetails.lastUpdated).toLocaleString() : 
    null
  
  console.log('lastUpdated:', initialEventDetails?.lastUpdated)
  console.log('formattedLastUpdated:', formattedLastUpdated)
  
  function navigateBack() {
    router.push('/')
  }

  // Render skeleton rows for tables
  const renderSkeletonRows = (count = 5) => {
    return Array(count).fill(0).map((_, index) => (
      <TableRow key={`skeleton-row-${index}`}>
        <TableCell style={{ width: '30%' }}>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="80%" />
        </TableCell>
      </TableRow>
    ));
  };

  // Skeleton for an entire section
  const renderSectionSkeleton = (title: string, rowCount = 5) => (
    <Box mb={4}>
      <Typography variant="h6" color="textPrimary" style={{ marginTop: 16, marginBottom: 16 }}>
        {title}
      </Typography>
      <Paper elevation={0} style={{ padding: 16, marginBottom: 16, background: 'transparent' }}>
        <TableContainer>
          <Table width="100%">
            <TableBody>
              {renderSkeletonRows(rowCount)}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );

  return (
    <Box width="100%" maxWidth="1200px">
      <Box mb={4} width="100%" display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <IconButton 
            onClick={navigateBack} 
            aria-label="back"
            sx={{
              color: theme.palette.primary.main,
              background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              mr: 2,
              padding: '8px',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                transform: 'translateX(-2px)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.5px",
              position: "relative",
              color: theme.palette.text.primary,
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -4,
                left: 0,
                width: "40%",
                height: 3,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 2
              },
              paddingBottom: "8px"
            }}
          >
            Transfer Details
          </Typography>
        </Box>
        
        {loading ? (
          <Skeleton variant="text" width={200} />
        ) : formattedLastUpdated && (
          <Typography variant="body2" color="text.secondary">
            Last Updated: {formattedLastUpdated}
          </Typography>
        )}
      </Box>

      {loading ? (
        // Skeleton loaders for when data is loading
        <>
          <Paper elevation={0} style={{ padding: 8, marginBottom: 16, background: 'transparent' }}>
            <TableContainer>
              <Table width="100%">
                <TableBody>
                  {renderSkeletonRows(9)}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          {renderSectionSkeleton("Hops", 3)}
          {renderSectionSkeleton("Source Transaction", 8)}
          {renderSectionSkeleton("Destination Transaction", 8)}
        </>
      ) : (
        // Actual content when data is loaded
        <>
          <Paper elevation={0} style={{ padding: 8, marginBottom: 16, background: 'transparent' }}>
            <TableContainer>
              <Table width="100%">
                <TableBody>
                  <DetailRow loading={loading} label="Transfer ID" value={transferId} />
                  <DetailRow loading={loading} label="Status" value={statusDisplay} />
                  <DetailRow loading={loading} label="Created" value={sourceTx.timestampDisplay} />
                  <DetailRow loading={loading} label="Token" value={sourceTokenDisplay} link={sourceTokenExplorerUrl} imageUrl={sourceTokenImageUrl} />
                  <DetailRow loading={loading} label="Origin Chain" value={sourceTx.chainDisplay} imageUrl={sourceTx.chainImageUrl} />
                  <DetailRow loading={loading} label="Target Chain" value={destinationChainDisplay} imageUrl={destinationChainImageUrl} />
                  <DetailRow loading={loading} label="Transfer Recipient" value={transferRecipient} link={transferRecipientExplorerUrl} />
                  <DetailRow loading={loading} label="Path ID" value={pathId} link={`/p/${pathId}`} />
                  <DetailRow loading={loading} label="Amount" value={transferAmountDisplay} />
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2} mb={2}>
              <Typography variant="subtitle1" color="textPrimary">Hops</Typography>
            </Box>

            {hops.map((hop: any, i: number) => {
              const { pathId, maxBonderFeeDisplay, maxTotalSentDisplay, attestedClaimId} = hop
              return (
                <Box ml={2} mb={4} key={i}>
                  <TableContainer>
                    <Table width="100%">
                      <TableBody>
                        <DetailRow label={`Hop #${i+1}`} value=" " />
                        <DetailRow label="Path ID" value={pathId} link={`/p/${pathId}`} />
                        <DetailRow label="Max Bonder Fee" value={maxBonderFeeDisplay} />
                        <DetailRow label="Max Total Sent" value={maxTotalSentDisplay} />
                        <DetailRow label="Attested Claim ID" value={attestedClaimId} />
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )
            })}
          </Paper>

          <Typography variant="h6" color="textPrimary" style={{ marginTop: 16 }}>Source Transaction</Typography>
          <Paper elevation={0} style={{ padding: 16, marginBottom: 16, background: 'transparent' }}>
            <TableContainer>
              <Table width="100%">
                <TableBody>
                  <DetailRow loading={loading} label="Chain" value={sourceTx.chainDisplay} imageUrl={sourceTx.chainImageUrl} />
                  <DetailRow loading={loading} label="Hash" value={sourceTx.transactionHash} link={sourceTx.transactionExplorerUrl} />
                  <DetailRow loading={loading} label="Status" value={sourceTx.statusDisplay} />
                  <DetailRow loading={loading} label="From Address" value={sourceTx.from} link={sourceTx.fromExplorerUrl} />
                  <DetailRow loading={loading} label="To Address" value={sourceTx.to} link={sourceTx.toExplorerUrl} />
                  <DetailRow loading={loading} label="Value" value={sourceTx.valueDisplay} />
                  <DetailRow loading={loading} label="Gas Limit" value={sourceTx.gasLimit} />
                  <DetailRow loading={loading} label="Gas Used" value={sourceTx.gasUsed} />
                  <DetailRow loading={loading} label="Gas Price" value={sourceTx.gasPriceDisplay} />
                  <DetailRow loading={loading} label="Nonce" value={sourceTx.nonce} />
                  <DetailRow loading={loading} label="Block Number" value={sourceTx.blockNumber} />
                  <DetailRow loading={loading} label="Calldata" value={sourceTx.data} maxWidth={600} />
                  {!!sourceTx.dataDecoded && (
                    <DetailRow loading={loading} label="Decoded Calldata" value={
                      <DecodedSendDataTable data={sourceTx.dataDecoded} />
                    } />
                  )}
                  <DetailRow loading={loading} label="Event Source Pool" value={sourcePoolDisplay} />
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {destinationTxs.map((destinationTx: any, i: number) => {

            const {
              data,
              dataDecoded,
              blockTimestamp,
              blockTimestampRelative,
              timestampDisplay,
              status,
              statusDisplay,
              value,
              valueDisplay,
              gasLimit,
              gasUsed,
              gasPrice,
              gasPriceDisplay,
              nonce,
              blockNumber,
              fromDisplay,
              fromExplorerUrl,
              txTo,
              txToExplorerUrl,
              tokenAddress,
              tokenDisplay,
              claimId,
              chainDisplay,
              chainImageUrl,
              tokenExplorerUrl,
              amountDisplay,
              bonderFeeDisplay,
              to,
              toExplorerUrl,
              pathId,
              transactionHash,
              transactionExplorerUrl,
            } = destinationTx

              return (
                <Box ml={2} mb={4} key={i}>
                  <Typography variant="h6" color="textPrimary" style={{ marginTop: 16 }}>Destination Transaction <small>(Hop #{i + 1})</small></Typography>
                  <Paper elevation={0} style={{ padding: 16, marginBottom: 16, background: 'transparent' }}>
                    <TableContainer>
                      <Table width="100%">
                        <TableBody>
                          <DetailRow loading={loading} label="Claim ID" value={claimId} />
                          <DetailRow loading={loading} label="Chain" value={chainDisplay} imageUrl={chainImageUrl} />
                          <DetailRow loading={loading} label="Token" value={tokenDisplay} link={tokenExplorerUrl} />
                          <DetailRow loading={loading} label="Timestamp" value={timestampDisplay} />
                          <DetailRow loading={loading} label="Transfer Amount" value={amountDisplay} />
                          <DetailRow loading={loading} label="Bonder Fee" value={bonderFeeDisplay} />
                          <DetailRow loading={loading} label="Recipient" value={to} link={toExplorerUrl} />
                          <DetailRow loading={loading} label="Path ID" value={pathId} link={`/p/${pathId}`} />
                          <DetailRow loading={loading} label="Hash" value={transactionHash} link={transactionExplorerUrl} />
                          <DetailRow loading={loading} label="Status" value={statusDisplay} />
                          <DetailRow loading={loading} label="From Address (Bonder)" value={fromDisplay} link={fromExplorerUrl} />
                          <DetailRow loading={loading} label="To Address" value={txTo} link={txToExplorerUrl} />
                          <DetailRow loading={loading} label="Value" value={valueDisplay} />
                          <DetailRow loading={loading} label="Gas Limit" value={gasLimit} />
                          <DetailRow loading={loading} label="Gas Used" value={gasUsed} />
                          <DetailRow loading={loading} label="Gas Price" value={gasPriceDisplay} />
                          <DetailRow loading={loading} label="Nonce" value={nonce} />
                          <DetailRow loading={loading} label="Block Number" value={blockNumber} />
                          <DetailRow loading={loading} label="Calldata" value={data} maxWidth={600} />
                          {!!dataDecoded && (
                            <DetailRow loading={loading} label="Decoded Calldata" value={
                              <DecodedBondDataTable data={dataDecoded} />
                            } />
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>
              )
            })}
          </>
        )}
    </Box>
  )
}
