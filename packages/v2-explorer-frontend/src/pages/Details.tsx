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

const DetailRow = ({ loading, label, value, link, skeletonWidth = 200 }: any) => {
  const styles = useStyles();
  return (
    <TableRow className={styles.tableRow}>
      <TableCell>{label}:</TableCell>
      <TableCell>
        {loading ? (
          <Skeleton variant="rectangular" width={skeletonWidth} height={20} />
        ) : (
          link ? (
            <CopyToClipboardText text={value}>
              <Link href={link} target="_blank" rel="noreferrer">
                {value}
              </Link>
            </CopyToClipboardText>
          ) : (
            <CopyToClipboardText text={value}>{value}</CopyToClipboardText>
          )
        )}
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
    sourceTxValueDisplay,
    sourceTxGasPriceDisplay,
    destinationAmountOutDisplay,
    loading,
    event,
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
            <DetailRow loading={loading} label="Token" value={token ? `${tokenName} (${tokenSymbol})` : null} link={token?.tokenExplorerUrl} />
            <DetailRow loading={loading} label="Created" value={context?.blockTimestamp} />
            <DetailRow loading={loading} label="Source Chain" value={context?.chainLabel} />
            <DetailRow loading={loading} label="Source Transaction Hash" value={context?.transactionHash} link={context?.transactionHashExplorerUrl} />
            <DetailRow loading={loading} label="Source Transaction Status" value={context?.status?.toString()} />
            <DetailRow loading={loading} label="Source Transaction From Address" value={context?.from} link={context?.fromExplorerUrl} />
            <DetailRow loading={loading} label="Source Transaction To Address" value={context?.to} link={context?.toExplorerUrl} />
            <DetailRow loading={loading} label="Source Transaction Value" value={sourceTxValueDisplay} />
            <DetailRow loading={loading} label="Source Transaction Gas Limit" value={context?.gasLimit} />
            <DetailRow loading={loading} label="Source Transaction Gas Used" value={context?.gasUsed} />
            <DetailRow loading={loading} label="Source Transaction Gas Price" value={sourceTxGasPriceDisplay} />
            <DetailRow loading={loading} label="Source Transaction Nonce" value={context?.nonce} />
            <DetailRow loading={loading} label="Source Transaction Block Number" value={context?.blockNumber} />
            <DetailRow loading={loading} label="Source Transaction Calldata" value={context?.data} />
            <DetailRow loading={loading} label="Destination Chain" value={event?.toChainLabel} />
            <DetailRow loading={loading} label="Destination Token" value={token ? `${tokenName} (${tokenSymbol})` : null} link={token?.tokenExplorerUrl} />
            <DetailRow loading={loading} label="Transfer Recipient" value={event?.to} link={event?.toExplorerUrl} />
            <DetailRow loading={loading} label="Transfer Amount" value={sourceTxValueDisplay} />
            <DetailRow loading={loading} label="Transfer Attestation Fee" value={context?.attestationFee} />
            <DetailRow loading={loading} label="Transfer Checkpoint" value={event?.checkpoint} />
            <DetailRow loading={loading} label="Transfer Checkpoint Total Sent" value={context?.totalSent} />
            <DetailRow loading={loading} label="Transfer Nonce" value={context?.nonce} />
            <DetailRow loading={loading} label="Path ID" value={context?.pathId} />
            <DetailRow loading={loading} label="Destination Transaction Hash" value={destinationContext?.transactionHash} link={destinationContext?.transactionHashExplorerUrl} />
            <DetailRow loading={loading} label="Destination Transfer Amount Out" value={destinationAmountOutDisplay} />
            <DetailRow loading={loading} label="Destination Transaction From Address (Bonder)" value={destinationContext?.from} link={destinationContext?.fromExplorerUrl} />
            <DetailRow loading={loading} label="Destination Transaction To Address" value={destinationContext?.to} link={destinationContext?.toExplorerUrl} />
            <DetailRow loading={loading} label="Destination Transaction Calldata" value={destinationContext?.data} />
          </TableBody>
        </Table>
      </TableContainer>
    </SiteWrapper>
  );
}
