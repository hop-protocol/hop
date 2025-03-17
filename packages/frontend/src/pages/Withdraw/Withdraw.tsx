import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import useQueryParams from '#hooks/useQueryParams.js'
import { Alert } from '#components/Alert/index.js'
import { Button } from '#components/Button/Button.js'
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { LargeTextField } from '#components/LargeTextField/index.js'
import { WithdrawalProof } from '@hop-protocol/sdk/utils'
import { formatError } from '#utils/format.js'
import { makeStyles } from '@mui/styles'
import { reactAppNetwork } from '#config/index.js'
import { toTokenDisplay } from '#utils/index.js'
import { updateQueryParams } from '#utils/updateQueryParams.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { useV2 } from '#hooks/useV2.js'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { constants } from 'ethers'

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
  versionToggle: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  }
}))

function useWithdrawV1() {
  const { sdk, networks, txConfirm } = useApp()
  const { checkConnectedNetworkId } = useWeb3Context()
  const { queryParams } = useQueryParams()
  const [transferIdOrTxHash, setTransferIdOrTxHash] = useState<string>(() => {
    return queryParams?.transferId as string || ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [withdrawTxHash, setWithdrawTxHash] = useState<string>('')

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
      setWithdrawTxHash('')
      let wp: WithdrawalProof
      await new Promise((resolve, reject) => {
        const run = async () => {
          try {
            wp = new WithdrawalProof(reactAppNetwork, transferIdOrTxHash)
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
                  wp.checkWithdrawable()
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
                  let token = wp.transfer.token
                  if (token === 'USDC') {
                    token = 'USDC.e'
                  }
                  const bridge = sdk.bridge(token)
                  const tx = await bridge.withdraw(
                    wp.transfer.destinationChain,
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
                    totalLeaves
                  )
                  setWithdrawTxHash(tx.hash)
                  return tx
                },
                onError: (err: any) => {
                  reject(err)
                },
              },
              onConfirm: async () => {}, // needed to close modal
            })
            resolve(null)
          } catch (err) {
            console.error('withdraw check error', err)

            try {
              const bridge = sdk.bridge('USDC')
              const data = await bridge.getCctpWithdrawData(transferIdOrTxHash)
              if (data) {
                const { transactionHash, fromChain, toChain, toChainId, nonceUsed } = data
                if (nonceUsed) {
                  reject(new Error('The withdrawal for this transfer has already been processed. The funds should have been received at the destination. No further action is required.'))
                  return
                }
                await txConfirm?.show({
                  kind: 'withdrawReview',
                  inputProps: {
                    source: {
                      network: fromChain,
                    },
                    getProof: async () => {
                      return null
                    },
                    getInfo: async () => {
                      return null
                    },
                    sendTx: async () => {
                      const networkId = Number(toChainId)
                      const isNetworkConnected = await checkConnectedNetworkId(networkId)
                      if (!isNetworkConnected) {
                        throw new Error('wrong network connected')
                      }
                      const tx = await bridge.cctpWithdraw(fromChain, toChain, transactionHash)
                      setWithdrawTxHash(tx.hash)
                      return tx
                    },
                    onError: (err: any) => {
                      reject(err)
                    },
                  },
                  onConfirm: async () => {}, // needed to close modal
                })
              }
            } catch (err: any) {
              console.error('withdraw check error cctp', error)
            }

            reject(err)
          }
        }
        run().catch(reject)
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

  return {
    transferIdOrTxHash,
    loading,
    error,
    withdrawTxHash,
    handleSubmit,
    handleInputChange
  }
}

function useWithdrawV2() {
  const { sdk, networks, txConfirm } = useApp()
  const { checkConnectedNetworkId, connectedNetworkId, provider} = useWeb3Context()
  const { queryParams } = useQueryParams()
  const { v2Sdk } = useV2()
  const [transferIdOrTxHash, setTransferIdOrTxHash] = useState<string>(() => {
    return queryParams?.transferId as string || ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  let [transferSentEvent, setTransferSentEvent] = useState<any>(null)
  let [messageSentEvent, setMessageSentEvent] = useState<any>(null)
  const [pushClaimTxHash, setPushClaimTxHash] = useState<string>('')
  const [executeTxHash, setExecuteTxHash] = useState<string>('')
  const [withdrawTxHash, setWithdrawTxHash] = useState<string>('')

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
      setPushClaimTxHash('')
      setExecuteTxHash('')
      setWithdrawTxHash('')

      const chainId = connectedNetworkId
      const sendTxHash = transferIdOrTxHash

      console.log('sendTxHash:', sendTxHash)

      // v2Sdk.setExplorerApiBaseUrl('http://localhost:8000')

      const status = await v2Sdk.getTransferStatus({
        transactionHash: sendTxHash
      })

      if (!status) {
        throw new Error('Transfer not found. Please check the transaction hash and connect to the correct source chain network.')
      }

      const destinationChainId = (status.transferSentEvent as any)?.toChainId as number
      if (!destinationChainId) {
        throw new Error('Destination chain ID not found on the transfer sent event.')
      }

      const sourceRailsGateway = v2Sdk.getRailsGateway(chainId)
      const sourceMessenger = v2Sdk.getMessenger(chainId)

      if (!transferSentEvent) {
        transferSentEvent = (await sourceRailsGateway.getTransferSentEventFromTransactionHash({
          transactionHash: sendTxHash,
        }))

        setTransferSentEvent(transferSentEvent)
      }

      if (!transferSentEvent) {
        throw new Error('Transfer sent event not found. Please check the transaction hash and connect to the correct network.')
      }

      console.log('transferSentEvent:', transferSentEvent)

      if (!messageSentEvent) {
        const messageId = await sourceMessenger.getMessageIdFromTransactionHash({
          transactionHash: sendTxHash
        })

        console.log('messageId:', messageId)

        messageSentEvent = (await sourceMessenger.getMessageSentEventFromTransactionHash({
          transactionHash: sendTxHash
        }))

        setMessageSentEvent(messageSentEvent)
      }

      console.log('messageSentEvent:', messageSentEvent)

      const nextHopsHash = await sourceRailsGateway.getNextHopsHash({ nextHops: transferSentEvent.decoded.hops.slice(1) })
      const signer = provider?.getSigner()
      if (!signer) {
        throw new Error('Signer not found. Please connect to the correct network.')
      }

      // TODO: improve this in v2 sdk
      await v2Sdk.utils.switchChain(destinationChainId, provider)
      v2Sdk.setProvider(destinationChainId, signer)

      const destRailsGateway = v2Sdk.getRailsGateway(destinationChainId)
      const destMessenger = v2Sdk.getMessenger(destinationChainId)

      let claim: any = null
      try {
        claim = await destRailsGateway.getClaim({
          pathId: transferSentEvent.decoded.pathId,
          claimId: transferSentEvent.decoded.transferId
        })

        console.log('claim:', claim, {
          pathId: transferSentEvent.decoded.pathId,
          claimId: transferSentEvent.decoded.transferId
        })
      } catch (err: any) {
        console.warn(err)
      }
        
      let shouldWithdraw = !claim || claim.bondedOrWithdrawnBy === constants.AddressZero
      if (!shouldWithdraw) {
        throw new Error(`Claim already bonded or withdrawn by "${claim.bondedOrWithdrawnBy}. No further action is required.`)
      }

      const shouldPushClaim = !claim || claim.createdAt.eq(0)
      console.log('shouldPushClaim:', shouldPushClaim)

      if (shouldPushClaim) {
        const pushClaimTx = await destRailsGateway.pushClaim({
          pathId: transferSentEvent.decoded.pathId,
          claimId: transferSentEvent.decoded.transferId,
          to: transferSentEvent.decoded.to,
          amount: transferSentEvent.decoded.amount,
          maxBonderFee: transferSentEvent.decoded.hops[0].maxBonderFee,
          attestedClaimId: transferSentEvent.decoded.hops[0].attestedClaimId,
          sourcePool: transferSentEvent.decoded.sourcePool,
          nextHopsHash
        })
        setPushClaimTxHash(pushClaimTx.hash)
        await pushClaimTx.wait()
      }

      const shouldExecute = true // debug
      console.log('shouldExecute:', shouldExecute)

      if (shouldExecute) {
        try {
          const executeTx = await destMessenger.execute({
            messageId: messageSentEvent.decoded.messageId,
            fromChainId: chainId,
            toChainId: messageSentEvent.decoded.toChainId,
            fromAddress: messageSentEvent.decoded.from,
            toAddress: messageSentEvent.decoded.to,
            toCalldata: messageSentEvent.decoded.data
          })
          setExecuteTxHash(executeTx.hash)
          await executeTx.wait()
        } catch (err: any) {
          console.error(err)
        }
      }

      claim = await destRailsGateway.getClaim({
        pathId: transferSentEvent.decoded.pathId,
        claimId: transferSentEvent.decoded.transferId
      })

      shouldWithdraw = claim.bondedOrWithdrawnBy === constants.AddressZero
      console.log('shouldWithdraw:', shouldWithdraw)

      if (shouldWithdraw) {
        const withdrawTx = await destRailsGateway.withdrawClaim({
          pathId: transferSentEvent.decoded.pathId,
          claimId: transferSentEvent.decoded.transferId,
          nextHops: transferSentEvent.decoded.hops.slice(1)
        })
        setWithdrawTxHash(withdrawTx.hash)
        await withdrawTx.wait()
      }

      if (!shouldWithdraw) {
        throw new Error('Claim already bonded or withdrawn. No further action is required.')
      }
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setLoading(false)
  }

  function handleInputChange(event: ChangeEvent<any>) {
    setTransferIdOrTxHash(event.target.value)
  }

  return {
    transferIdOrTxHash,
    loading,
    error,
    pushClaimTxHash,
    executeTxHash,
    withdrawTxHash,
    handleSubmit,
    handleInputChange
  }
}

export const Withdraw: FC = () => {
  const styles = useStyles()
  const [isV2, setIsV2] = useState(false)

  const v1 = useWithdrawV1()
  const v2 = useWithdrawV2()

  const {
    transferIdOrTxHash,
    loading,
    error,
    withdrawTxHash,
    handleSubmit,
    handleInputChange
  } = isV2 ? v2 : v1

  const handleVersionToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsV2(event.target.checked)
  }

  return (
    <Box className={styles.root}>
      <Box className={styles.header}>
        <Typography variant="h4">Withdraw</Typography>
      </Box>
      <Box className={styles.versionToggle}>
        <FormControlLabel
          control={
            <Switch
              checked={isV2}
              onChange={handleVersionToggle}
              name="versionToggle"
              color="primary"
            />
          }
          label={<>
              <Typography variant="body2" color="secondary" component="span">v2</Typography>
              <InfoTooltip
                title={
                  "Enable this if your transfer is using Hop v2 protocol."
                }
              />
          </>}
        />
      </Box>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Box>
          <Card className={styles.card}>
            <Typography variant="h6">
                Transfer ID
              <InfoTooltip
                title={
                  isV2 
                    ? 'Enter the origin transaction hash of transfer to withdraw at the destination. You can use this to withdraw unbonded transfers. The transfer ID can be found in the Hop V2 explorer.'
                    : 'Enter the transfer ID or origin transaction hash of transfer to withdraw at the destination. You can use this to withdraw unbonded transfers after the transfer root has been propagated to the destination. The transfer ID can be found in the Hop explorer.'
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
      {isV2 && v2.pushClaimTxHash && (
        <Box className={styles.notice} mt={2}>
          <Alert severity="info">Push Claim tx: {v2.pushClaimTxHash}</Alert>
        </Box>
      )}
      {isV2 && v2.executeTxHash && (
        <Box className={styles.notice} mt={2}>
          <Alert severity="info">Execute tx: {v2.executeTxHash}</Alert>
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
