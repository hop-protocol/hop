import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import useQueryParams from '#hooks/useQueryParams.js'
import { Alert } from '#components/Alert/index.js'
import { Button } from '#components/Button/Button.js'
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { LargeTextField } from '#components/LargeTextField/index.js'
import { formatError } from '#utils/format.js'
import { makeStyles } from '@mui/styles'
import { updateQueryParams } from '#utils/updateQueryParams.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { useV2 } from '#hooks/useV2.js'

const useStyles = makeStyles((theme: any) => ({
  root: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '4rem',
    textAlign: 'center',
  },
  form: {
    display: 'block',
    marginBottom: '4rem',
  },
  card: {
    marginBottom: '4rem',
  },
  loader: {
    marginTop: '2rem',
    textAlign: 'center',
  },
  notice: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
}))

export const WithdrawV2: FC = () => {
  const styles = useStyles()
  const { sdk, networks, txConfirm } = useApp()
  const { checkConnectedNetworkId, connectedNetworkId } = useWeb3Context()
  const { queryParams } = useQueryParams()
  const [transferIdOrTxHash, setTransferIdOrTxHash] = useState<string>(() => {
    return queryParams?.transferId as string || ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [confirmClaimTxHash, setConfirmClaimTxHash] = useState<string>('')
  const [withdrawTxHash, setWithdrawTxHash] = useState<string>('')
  const { v2Sdk } = useV2()

  useEffect(() => {
    try {
      updateQueryParams({
        transferId: transferIdOrTxHash || ''
      })
    } catch (err: any) {
      console.error(err)
    }
  }, [transferIdOrTxHash])

  async function handleSubmit(event: ChangeEvent<any>) {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      setConfirmClaimTxHash('')
      setWithdrawTxHash('')

      const chainId = connectedNetworkId
      const sendTxHash = transferIdOrTxHash
      const railsGateway = v2Sdk.getRailsGateway(chainId)

      const transferSentEvent = (await railsGateway.getTransferSentEventFromTransactionHash({
        transactionHash: sendTxHash,
      }))

      if (!transferSentEvent) {
        throw new Error('Transfer sent event not found. Please check the transaction hash and connect to the correct network.')
      }

      const nextHopsHash = await railsGateway.getNextHopsHash({ nextHops: transferSentEvent.decoded.hops.slice(1) })

      const confirmClaimTx = await railsGateway.confirmClaim({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId
      })
      setConfirmClaimTxHash(confirmClaimTx.hash)
      await confirmClaimTx.wait()

      // TODO: fix
      const withdrawTx = await railsGateway.postAndWithdraw({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId,
        to: transferSentEvent.decoded.to,
        amountOut: transferSentEvent.decoded.amount,
        maxBonderFee: transferSentEvent.decoded.hops[0].maxBonderFee,
        bonderFee: transferSentEvent.decoded.hops[0].maxBonderFee,
        attestedClaimId: transferSentEvent.decoded.hops[0].attestedClaimId,
        sourcePool: transferSentEvent.decoded.sourcePool,
        nextHops: transferSentEvent.decoded.hops.slice(1),
      })

      setWithdrawTxHash(withdrawTx.hash)
      await withdrawTx.wait()
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setLoading(false)
  }

  function handleInputChange(event: ChangeEvent<any>) {
    setTransferIdOrTxHash(event.target.value)
  }

  return (
    <Box className={styles.root}>
      <Box className={styles.header}>
        <Typography variant="h4">Withdraw V2</Typography>
      </Box>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Box>
          <Card className={styles.card}>
            <Typography variant="h6">
              Transaction Hash
              <InfoTooltip
                title={
                  'Enter the origin transaction hash of transfer to withdraw at the destination. You can use this to withdraw unbonded transfers. The transfer ID can be found in the Hop V2 explorer.'
                }
              />
              <Box ml={2} display="inline-flex">
                <Typography variant="body2" color="secondary" component="span">
                  Enter transfer ID or origin transaction hash
                </Typography>
              </Box>
            </Typography>
            <LargeTextField
              value={transferIdOrTxHash}
              onChange={handleInputChange}
              placeholder="0x123"
              smallFontSize
              leftAlign
            />
          </Card>
        </Box>
        <Box>
          <Button onClick={handleSubmit} loading={loading} large highlighted>
            Withdraw
          </Button>
        </Box>
      </form>
      <Box className={styles.notice}>
        <Alert severity="error">{error}</Alert>
      </Box>
      {confirmClaimTxHash && (
        <Box className={styles.notice} mt={2}>
          <Alert severity="info">Confirm Claim tx: {confirmClaimTxHash}</Alert>
        </Box>
      )}
      {withdrawTxHash && (
        <Box className={styles.notice} mt={2}>
          <Alert severity="success">Withdraw tx: {withdrawTxHash}</Alert>
        </Box>
      )}
    </Box>
  )
}
