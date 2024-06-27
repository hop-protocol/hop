import React from 'react';
import { Box, Chip, Link, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTransferDetails } from '../hooks/useTransferDetails';
import { CopyToClipboardText } from '../components/CopyToClipboardText';
import { SiteWrapper } from '../components/SiteWrapper';

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
}));

const DetailRow = ({ loading, label, value, link, imageUrl, skeletonWidth = 200 }: any) => {
  const styles = useStyles();
  return (
    <TableRow className={styles.tableRow}>
      <TableCell>{label}:</TableCell>
      <TableCell>
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
            ) : typeof value === 'string' ? (
              <CopyToClipboardText text={value}>{value}</CopyToClipboardText>
            ) : (value ? value : '-')
          )}
        </Box>
      </TableCell>
    </TableRow>
  )
}

export function Details() {
  const {
    transferId,
    status,
    token,
    context,
    destinationContext,
    tokenName,
    tokenSymbol,
    transferAmountDisplay,
    checkpointTotalSent,
    checkpointTotalSentFormatted,
    checkpointTotalSentDisplay,
    transferRecipient,
    transferRecipientExplorerUrl,
    attestationFeeDisplay,
    checkpoint,
    transferNonce,
    pathId,
    sourceTxValue,
    sourceTxValueFormatted,
    sourceTxValueDisplay,
    sourceTxTransactionHash,
    sourceTxTransactionExplorerUrl,
    sourceTxGasLimit,
    sourceTxNonce,
    sourceTxGasUsed,
    sourceTxGasPrice,
    sourceTxGasPriceFormatted,
    sourceTxGasPriceDisplay,
    sourceTxStatus,
    sourceTxFrom,
    sourceTxChainId,
    sourceTxChainDisplay,
    sourceTxChainImageUrl,
    sourceTxFromExplorerUrl,
    sourceTxTo,
    sourceTxToExplorerUrl,
    sourceTokenAddress,
    sourceTokenDisplay,
    sourceTokenExplorerUrl,
    sourceTxStatusDisplay,
    sourceTxBlockTimestamp,
    sourceTxBlockTimestampRelative,
    sourceTxTimestampDisplay,
    sourceTxBlockNumber,
    sourceTxData,
    destinationChainDisplay,
    destinationChainImageUrl,
    destinationTransactionHash,
    destinationTransactionExplorerUrl,
    destinationAmountOutDisplay,
    destinationTxFromDisplay,
    destinationTxFromExplorerUrl,
    destinationTxToDisplay,
    destinationTxToExplorerUrl,
    destinationTokenAddress,
    destinationTokenDisplay,
    destinationTokenExplorerUrl,
    destinationTxData,
    loading,
  } = useTransferDetails();

  return (
    <SiteWrapper>
      <Box mb={4} width="100%" display="flex" justifyContent="flex-start">
        <Typography variant="h5" color="textPrimary">Transfer details</Typography>
      </Box>

      <TableContainer>
        <Table width="100%">
          <TableBody>
            <DetailRow loading={loading} label="Transfer ID" value={transferId} />
            <DetailRow loading={loading} label="Status" value={status} />
            <DetailRow loading={loading} label="Token" value={sourceTokenDisplay} link={sourceTokenExplorerUrl} />
            <DetailRow loading={loading} label="Created" value={sourceTxBlockTimestamp} />
            <DetailRow loading={loading} label="Source Chain" value={sourceTxChainDisplay} imageUrl={sourceTxChainImageUrl} />
            <DetailRow loading={loading} label="Source Transaction Hash" value={sourceTxTransactionHash} link={sourceTxTransactionExplorerUrl} />
            <DetailRow loading={loading} label="Source Transaction Status" value={sourceTxStatusDisplay} />
            <DetailRow loading={loading} label="Source Transaction From Address" value={sourceTxFrom} link={sourceTxFromExplorerUrl} />
            <DetailRow loading={loading} label="Source Transaction To Address" value={sourceTxTo} link={sourceTxToExplorerUrl} />
            <DetailRow loading={loading} label="Source Transaction Value" value={sourceTxValueDisplay} />
            <DetailRow loading={loading} label="Source Transaction Gas Limit" value={sourceTxGasLimit} />
            <DetailRow loading={loading} label="Source Transaction Gas Used" value={sourceTxGasUsed} />
            <DetailRow loading={loading} label="Source Transaction Gas Price" value={sourceTxGasPriceDisplay} />
            <DetailRow loading={loading} label="Source Transaction Nonce" value={sourceTxNonce} />
            <DetailRow loading={loading} label="Source Transaction Block Number" value={sourceTxBlockNumber} />
            <DetailRow loading={loading} label="Source Transaction Calldata" value={sourceTxData} />
            <DetailRow loading={loading} label="Destination Chain" value={destinationChainDisplay} imageUrl={destinationChainImageUrl} />
            <DetailRow loading={loading} label="Destination Token" value={destinationTokenDisplay} link={destinationTokenExplorerUrl} />
            <DetailRow loading={loading} label="Transfer Recipient" value={transferRecipient} link={transferRecipientExplorerUrl} />
            <DetailRow loading={loading} label="Transfer Amount" value={sourceTxValueDisplay} />
            <DetailRow loading={loading} label="Transfer Attestation Fee" value={attestationFeeDisplay} />
            <DetailRow loading={loading} label="Transfer Checkpoint" value={checkpoint} />
            <DetailRow loading={loading} label="Transfer Checkpoint Total Sent" value={checkpointTotalSentDisplay} />
            <DetailRow loading={loading} label="Transfer Nonce" value={transferNonce} />
            <DetailRow loading={loading} label="Path ID" value={pathId} />
            <DetailRow loading={loading} label="Destination Transaction Hash" value={destinationTransactionHash} link={destinationTransactionExplorerUrl} />
            <DetailRow loading={loading} label="Destination Transfer Amount Out" value={destinationAmountOutDisplay} />
            <DetailRow loading={loading} label="Destination Transaction From Address (Bonder)" value={destinationTxFromDisplay} link={destinationTxFromExplorerUrl} />
            <DetailRow loading={loading} label="Destination Transaction To Address" value={destinationTxToDisplay} link={destinationTxToExplorerUrl} />
            <DetailRow loading={loading} label="Destination Transaction Calldata" value={destinationTxData} />
          </TableBody>
        </Table>
      </TableContainer>
    </SiteWrapper>
  );
}
