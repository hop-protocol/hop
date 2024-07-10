import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import useQueryParams from '#hooks/useQueryParams.js'
import { Alert } from '#components/Alert/index.js'
import { Button } from '#components/Button/Button.js'
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { LargeTextField } from '#components/LargeTextField/index.js'
import { getRelayer, getTransferCommittedEventForTransferId } from './relayer/index.js'
import { ChainSlug, NetworkSlug } from '@hop-protocol/sdk'
import { formatError } from '#utils/format.js'
import { makeStyles } from '@mui/styles'
import { reactAppNetwork } from '#config/index.js'
import { updateQueryParams } from '#utils/updateQueryParams.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import RaisedSelect from '#components/selects/RaisedSelect.js'
import MenuItem from '@mui/material/MenuItem'
import Link from '@mui/material/Link'
import SelectOption from '#components/selects/SelectOption.js'
import { l2Networks, l1Network } from '#config/networks.js'
import Network from '#models/Network.js'
import { findNetworkBySlug, findMatchingBridge } from '#utils/index.js'
import { wait } from '#utils/wait.js'

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

export const Relay: FC = () => {
  const styles = useStyles()
  const { sdk, networks, txConfirm, bridges, selectedBridge, setSelectedBridge } = useApp()
  const { checkConnectedNetworkId } = useWeb3Context()
  const { queryParams } = useQueryParams()
  const [transferIdOrTxHash, setTransferIdOrTxHash] = useState<string>(() => {
    return queryParams?.transferId as string || ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [commitTxHashForTransferId, setCommitTxHashForTransferId] = useState<string>('')
  const [commitInfoMsg, setCommitInfoMsg] = useState<string>('')
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(() => {
    try {
      const selectedNetworkSlug = localStorage.getItem('relay:selectedNetwork')
      if (selectedNetworkSlug) {
        const network = findNetworkBySlug(selectedNetworkSlug, l2Networks)
        if (network) {
          return network
        }
      }
    } catch (err: any) {
    }
    return l2Networks[0]
  })

  useEffect(() => {
    try {
      updateQueryParams({
        transferId: transferIdOrTxHash || ''
      })
    } catch (err: any) {
      console.error(err)
    }
  }, [transferIdOrTxHash])

  useEffect(() => {
    try {
      localStorage.setItem('relay:selectedNetwork', selectedNetwork?.slug ?? '')
    } catch (err: any) {
      console.error(err)
    }
  }, [selectedNetwork])

  const handleBridgeChange = (event: any) => {
    const tokenSymbol = event.target.value as string

    const bridge = findMatchingBridge(bridges, tokenSymbol)
    if (bridge) {
      setSelectedBridge(bridge)
    }
  }

  async function handleSubmit(event: ChangeEvent<any>) {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      setCommitTxHashForTransferId('')
      setCommitInfoMsg('')
      await new Promise((resolve, reject) => {
        const run = async () => {
          console.log('selectedNetwork', selectedNetwork)
          let isNetworkConnected = await checkConnectedNetworkId(l1Network.networkId)
          if (!isNetworkConnected) {
            throw new Error('wrong network connected')
          }
          const l1Wallet = await sdk.getSignerOrProvider(l1Network.slug)
          const l2Wallet = await sdk.getSignerOrProvider(selectedNetwork.slug)
          let token = selectedBridge.getTokenSymbol()
          if (token === 'USDC.e') {
            token = 'USDC' // it needs to be USDC for graph lookups for USDC.e
          }
          console.log('reactAppNetwork', reactAppNetwork)
          console.log('l1Wallet', l1Wallet)
          console.log('l2Wallet', l2Wallet)
          console.log('token', token)
          let transferId = transferIdOrTxHash
          const transferStatus = await sdk.getTransferStatus(transferId)
          console.log('transferStatus', transferStatus)
          const bonded = transferStatus?.[0]?.bonded
          if (bonded) {
            throw new Error(`The transfer has already been bonded or withdrawn. There's no need to relay.`)
          }
          if (transferStatus?.[0]?.transferId && transferStatus?.[0]?.transferId !== transferId) {
            transferId = transferStatus?.[0]?.transferId
          }
          setCommitInfoMsg(`Searching for the commit transaction hash for transfer ID ${transferId}...`)
          let commitTxHash = '' // for debugging
          if (!commitTxHash) {
            const event = await getTransferCommittedEventForTransferId(selectedNetwork.slug, token, transferId)
            console.log('event', event)
            commitTxHash = event?.transactionHash
          setCommitInfoMsg('')
          }
          if (!commitTxHash) {
            setCommitInfoMsg(`The commit transaction hash was not found for this transfer. Initiating a transaction request to commit the transfers from ${selectedNetwork.slug} to ${l1Network.slug}...`)
            const bridge = sdk.bridge(token)
            isNetworkConnected = await checkConnectedNetworkId(selectedNetwork.networkId)
            if (!isNetworkConnected) {
              throw new Error('wrong network connected')
            }
            const tx = await bridge.commitTransfers(selectedNetwork.slug, l1Network.slug)
            setCommitInfoMsg(`Commit transfers transaction hash: ${tx.hash}. Waiting for confirmation...`)
            await tx.wait()
            await wait(60 * 1000)
            setCommitInfoMsg(`Searching for the commit transaction hash for transfer ID ${transferId}...`)
          }
          if (!commitTxHash) {
            const event = await getTransferCommittedEventForTransferId(selectedNetwork.slug, token, transferId)
            console.log('event', event)
            commitTxHash = event?.transactionHash
            setCommitInfoMsg(``)
          }
          if (!commitTxHash) {
            throw new Error('The commit transaction hash was not found for this transfer, which is required for the relay. This means the transfer root has not been committed yet and it will just take a little longer until the exit transaction can be initiated. Your funds are safe.')
          }
          isNetworkConnected = await checkConnectedNetworkId(l1Network.networkId)
          if (!isNetworkConnected) {
            throw new Error('wrong network connected')
          }
          console.log('commitTxHash', commitTxHash)
          setCommitTxHashForTransferId(commitTxHash)
          const relayer = getRelayer(reactAppNetwork as NetworkSlug, selectedNetwork.slug as ChainSlug, l1Wallet, l2Wallet)
          try {
            const tx = await relayer.relayL2ToL1Message(commitTxHash)
            setSuccess(`Transaction hash: ${tx.hash}`)
            console.log('tx', tx)
            const receipt = await tx.wait()
            console.log('receipt', receipt)
          } catch (err: any) {
            console.error(err)
            throw new Error(`Failed to relay commit transfer tx on ${l1Network.slug}. Error: ${err.message}. You may need to wait a few more hours to relay this transfer.`)
          }
          setLoading(false)
          resolve(null)
        }
        run().catch(reject)
      })
    } catch (err: any) {
      console.error(err)
      setCommitInfoMsg('')
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
        <Typography variant="h4">Relay Transfer</Typography>
      </Box>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Box>

          <Box mb={2} display="flex" justifyContent="center">
            <Box display="flex" alignItems="center" justifyContent="center">

              <RaisedSelect value={selectedBridge?.getTokenSymbol()} onChange={handleBridgeChange}>
                {bridges.map(bridge => (
                  <MenuItem value={bridge.getTokenSymbol()} key={bridge.getTokenSymbol()}>
                    <SelectOption
                      value={bridge.getTokenSymbol()}
                      icon={bridge.getTokenImage()}
                      label={bridge.getTokenSymbol()}
                    />
                  </MenuItem>
                ))}
              </RaisedSelect>

              <Box mr={2}></Box>

              <RaisedSelect value={selectedNetwork?.slug} onChange={(event: any) => {
                const selectedNetworkSlug = event.target.value as string
                setSelectedNetwork(findNetworkBySlug(selectedNetworkSlug, l2Networks))
              }}>
                {l2Networks.map(network => (
                  <MenuItem value={network.slug} key={network.slug}>
                    <SelectOption value={network.slug} icon={network.imageUrl} label={network.name} />
                  </MenuItem>
                ))}
              </RaisedSelect>
              <Box ml={2} mr={2}>
                <Typography variant="subtitle1">To</Typography>
              </Box>
              <RaisedSelect value={l1Network.slug}>
                <MenuItem value={l1Network.slug} key={l1Network.slug}>
                  <SelectOption value={l1Network.slug} icon={l1Network.imageUrl} label={l1Network.name} />
                </MenuItem>
              </RaisedSelect>
              <InfoTooltip
                title={
                  'Only relays to Ethereum L1 are supported'
                }
              />
            </Box>
          </Box>

          <Card className={styles.card}>
            <Typography variant="h6">
              Transfer ID
              <InfoTooltip
                title={
                  'Enter the transfer ID or origin transaction hash to relay at destination'
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
            Relay
          </Button>
        </Box>
      </form>
      <Box className={styles.notice}>
        <Alert severity="error">{error}</Alert>
      </Box>
      <Box className={styles.notice}>
        <Alert severity="success">{success}</Alert>
      </Box>
      {commitTxHashForTransferId && (
        <Box className={styles.notice}>
          <Alert severity="info">Found commit tx hash: {commitTxHashForTransferId}</Alert>
        </Box>
      )}
      {commitInfoMsg && (
        <Box className={styles.notice}>
          <Alert severity="info">{commitInfoMsg}</Alert>
        </Box>
      )}
      <Box mt={10} display="flex" justifyContent="center" style={{ opacity: 0.7 }}>
        <Typography variant="body1">After the transfer has been relayed, it can then be withdrawn using the <Link href="#/withdraw">Withdraw page</Link>.</Typography>
      </Box>
    </Box>
  )
}
