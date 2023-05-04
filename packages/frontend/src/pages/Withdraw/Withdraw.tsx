import React, { FC, ChangeEvent, useEffect, useState } from 'react'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'
import LargeTextField from 'src/components/LargeTextField'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Alert from 'src/components/alert/Alert'
import { toTokenDisplay } from 'src/utils'
import { formatError } from 'src/utils/format'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Button from 'src/components/buttons/Button'
import InfoTooltip from 'src/components/InfoTooltip'
import useQueryParams from 'src/hooks/useQueryParams'
import { updateQueryParams } from 'src/utils/updateQueryParams'
import { reactAppNetwork } from 'src/config'
import { WithdrawalProof } from '@hop-protocol/sdk'

const useStyles = makeStyles((theme: any) => ({
  root: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  form: {
    display: 'block',
    marginBottom: '40px',
  },
  card: {
    marginBottom: '40px',
  },
  loader: {
    marginTop: '20px',
    textAlign: 'center',
  },
  notice: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
}))

export const Withdraw: FC = () => {
  const styles = useStyles()
  const { sdk, networks, txConfirm } = useApp()
  const { checkConnectedNetworkId } = useWeb3Context()
  const { queryParams } = useQueryParams()
  const [transferIdOrTxHash, setTransferIdOrTxHash] = useState<string>(() => {
    return localStorage.getItem('withdrawTransferIdOrTxHash') || queryParams?.transferId as string || ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    try {
      localStorage.setItem('withdrawTransferIdOrTxHash', transferIdOrTxHash)
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
      let wp: WithdrawalProof
      await new Promise(async (resolve, reject) => {
        try {
          wp = new WithdrawalProof(reactAppNetwork === 'goerli' ? 'goerli' : 'mainnet', transferIdOrTxHash)
          await wp.generateProof()
          const { sourceChain } = wp.transfer
          await txConfirm?.show({
            kind: 'withdrawReview',
            inputProps: {
              source: {
                network: sourceChain,
              },
              getProof: async () => {
                return wp
              },
              getInfo: async (wp: WithdrawalProof) => {
                const { sourceChain, destinationChain, token, tokenDecimals, amount } = wp.transfer
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
                  throw new Error('wrong network connected')
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
                  totalLeaves!
                )
                return tx
              },
              onError: err => {
                reject(err)
              },
            },
            onConfirm: async () => {}, // needed to close modal
          })
          resolve(null)
        } catch (err) {
          reject(err)
        }
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
                title={
                  'Enter the transfer ID or origin transaction hash of transfer to withdraw at the destination. You can use this to withdraw unbonded transfers after the transfer root has been propagated to the destination. The transfer ID can be found in the Hop explorer.'
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
        </div>
        <div>
          <Button onClick={handleSubmit} loading={loading} large highlighted>
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
