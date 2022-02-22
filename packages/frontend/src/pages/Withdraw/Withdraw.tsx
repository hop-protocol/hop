import React, { FC, ChangeEvent, useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import Card from '@material-ui/core/Card'
import { WithdrawalProof } from './WithdrawalProof'
import { makeStyles } from '@material-ui/core/styles'
import LargeTextField from 'src/components/LargeTextField'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Alert from 'src/components/alert/Alert'
import { toTokenDisplay } from 'src/utils'
import { formatError } from 'src/utils/format'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Button from 'src/components/buttons/Button'
import InfoTooltip from 'src/components/infoTooltip'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '4rem',
    textAlign: 'center'
  },
  form: {
    display: 'block',
    marginBottom: '4rem'
  },
  card: {
    marginBottom: '4rem'
  },
  loader: {
    marginTop: '2rem',
    textAlign: 'center'
  },
  notice: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  }
}))

export const Withdraw: FC = () => {
  const styles = useStyles()
  const { sdk, networks, txConfirm } = useApp()
  const { checkConnectedNetworkId } = useWeb3Context()
  const [transferIdOrTxHash, setTransferIdOrTxHash] = useState<string>(() => {
    return localStorage.getItem('withdrawTransferIdOrTxHash') || ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
      localStorage.setItem('withdrawTransferIdOrTxHash', transferIdOrTxHash)
  }, [transferIdOrTxHash])

  async function handleSubmit(event: ChangeEvent<any>) {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      let wp : WithdrawalProof
      await new Promise(async (resolve, reject) => {
        await txConfirm?.show({
          kind: 'withdrawReview',
          inputProps: {
            getProof: async () => {
              wp = new WithdrawalProof(transferIdOrTxHash)
              await wp.generateProof()
              return wp
            },
            getInfo: async(wp: WithdrawalProof) => {
              const { transferId, sourceChain, destinationChain, token, tokenDecimals, amount } = wp.transfer
              const formattedAmount = toTokenDisplay(amount, tokenDecimals)
              const source = networks.find(network => network.slug === sourceChain)
              const destination = networks.find(network => network.slug === destinationChain)
              return {
                source,
                destination,
                token,
                amount: formattedAmount,
              }
            },
            sendTx: async () => {
              await wp.checkWithdrawable()
              const networkId = Number(wp.transfer.destinationChainId)
              const isNetworkConnected = await checkConnectedNetworkId(networkId)
              if (!isNetworkConnected) {
                return
              }
              const {
                recipient,
                amount,
                transferNonce,
                bonderFee,
                amountOutMin,
                deadline,
                transferRootHash,
                rootTotalAmount,
                transferIdTreeIndex,
                siblings,
                totalLeaves,
              } = wp.getTxPayload()
              const bridge = sdk.bridge(wp.transfer.token)
              const tx = await bridge.withdraw(
                wp.transfer.destinationChain,
                recipient,
                amount,
                transferNonce,
                bonderFee,
                amountOutMin,
                deadline,
                transferRootHash!,
                rootTotalAmount!,
                transferIdTreeIndex!,
                siblings!,
                totalLeaves!,
              )
              return tx
            },
            onError: (err) => {
              reject(err)
            }
          },
          onConfirm: async () => { } // needed to close modal
        })
        resolve(null)
      })
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
    <div className={styles.root}>
      <div className={styles.header}>
        <Typography variant="h4">Withdraw</Typography>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <Card className={styles.card}>
            <Typography variant="h6">
              Transfer ID
          <InfoTooltip
            title={"Enter the transfer ID or transaction hash of transfer to withdraw at the destination. You can use this to withdraw unbonded transfers after the transfer root has been propagated to the destination."}
          />
            </Typography>
            <LargeTextField
              value={transferIdOrTxHash}
              onChange={handleInputChange}
              placeholder="0x123"
              smallFontSize
              leftAlign
            />
          </Card>
        </div>
        <div>
          <Button
            onClick={handleSubmit}
            loading={loading}
            large
            highlighted
          >
            Withdraw
          </Button>
        </div>
      </form>
      <div className={styles.notice}>
        <Alert severity="error">{error}</Alert>
      </div>
    </div>
  )
}
