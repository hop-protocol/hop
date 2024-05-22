import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import useQueryParams from '#hooks/useQueryParams.js'
import { Alert } from '#components/Alert/index.js'
import { Button } from '#components/Button/Button.js'
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { LargeTextField } from '#components/LargeTextField/index.js'
import { getRelayer, ChainSlug, NetworkSlug, getTransferCommittedEventForTransferId } from '@hop-protocol/sdk'
import { formatError } from '#utils/format.js'
import { makeStyles } from '@mui/styles'
import { reactAppNetwork } from '#config/index.js'
import { updateQueryParams } from '#utils/updateQueryParams.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import RaisedSelect from '#components/selects/RaisedSelect.js'
import MenuItem from '@mui/material/MenuItem'
import SelectOption from '#components/selects/SelectOption.js'
import { l2Networks, l1Network } from '#config/networks.js'
import Network from '#models/Network.js'
import { findNetworkBySlug, networkSlugToId } from '#utils/index.js'
import {
  useSelectedNetwork
} from '#hooks/index.js'

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
  const { sdk, networks, txConfirm } = useApp()
  const { checkConnectedNetworkId } = useWeb3Context()
  const { queryParams } = useQueryParams()
  const [txHash, setTxHash] = useState<string>(() => {
    return queryParams?.txHash as string || ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(l2Networks[0])
  // const { selectedNetwork, selectBothNetworks } = useSelectedNetwork()

  useEffect(() => {
    try {
      updateQueryParams({
        txHash: txHash || ''
      })
    } catch (err: any) {
      console.error(err)
    }
  }, [txHash])

  async function handleSubmit(event: ChangeEvent<any>) {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      await new Promise((resolve, reject) => {
        const run = async () => {
          console.log('selectedNetwork', selectedNetwork)
          const isNetworkConnected = await checkConnectedNetworkId(l1Network.networkId)
          if (!isNetworkConnected) {
            throw new Error('wrong network connected')
          }
          const l1Wallet = await sdk.getSignerOrProvider(l1Network.slug)
          const l2Wallet = await sdk.getSignerOrProvider(selectedNetwork.slug)
          console.log('reactAppNetwork', reactAppNetwork)
          console.log('l1Wallet', l1Wallet)
          console.log('l2Wallet', l2Wallet)
          // example commit txs
          // let commitTxHash = '0x86f1dfc3ced80aa27c1116ebda552b5cd5009eac5f6f3c2d01a521faae398677' // base ETH
          // let commitTxHash = '0xb3b1e32b65aab3dd5374130fe92ff3108fef1d5d61be62bb99e041e596b64265' // optimism ETH
          // let commitTxHash = '0x5a75ff2131895ec42da3bc851df8854683f20bb7dadb6f149e527da021d91456' // polygon ETH
          // let commitTxHash = '0x43c5f6baf4100fbd7924a9f0664f20ed8b36bf3feb4218aea41d1e01f5076bf4' // arbitrum ETH
          // let commitTxHash = '0x886158d6ce41723af5364b9f89d51416c09345ff920c8e7af23dfd67ccd34da2' // nova ETH
          // let commitTxHash = '0xc02c7337289afbc5d73199e26585da58b7cf77334f8d49255751a6da421a13a4' // gnosis ETH
          let commitTxHash = ''
          if (!commitTxHash) {
            const event = await getTransferCommittedEventForTransferId(selectedNetwork.slug, 'ETH', txHash)
            console.log('event', event)
            commitTxHash = event?.transactionHash
          }
          if (!commitTxHash) {
            throw new Error('The commit tx hash not found for transfer. This means the transfer root has not been committed yet.')
          }
          console.log('commitTxHash', commitTxHash)
          const relayer = getRelayer(reactAppNetwork as NetworkSlug, selectedNetwork.slug as ChainSlug, l1Wallet, l2Wallet)
          const tx = await relayer.relayL2ToL1Message(commitTxHash)
          setSuccess(tx.hash)
          console.log('tx', tx)
          const receipt = await tx.wait()
          console.log('receipt', receipt)
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
    setTxHash(event.target.value)
  }

  return (
    <Box className={styles.root}>
      <Box className={styles.header}>
        <Typography variant="h4">Relay</Typography>
      </Box>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Box>

          <Box display="flex" justifyContent="center">
            <Box display="flex" alignItems="center">
              <Box mr={2} display="flex" alignItems="center">
                <Typography variant="subtitle1">
                  Source Chain
                </Typography>
              </Box>
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
            </Box>
          </Box>
          <Box display="flex" justifyContent="center">
            <Box display="flex" alignItems="center">
              <Box mr={2} display="flex" alignItems="center">
                <Typography variant="subtitle1">
                  Destination Chain
                </Typography>
              </Box>
              <RaisedSelect value={l1Network.slug}>
                <MenuItem value={l1Network.slug} key={l1Network.slug}>
                  <SelectOption value={l1Network.slug} icon={l1Network.imageUrl} label={l1Network.name} />
                </MenuItem>
              </RaisedSelect>
            </Box>
          </Box>


          <Card className={styles.card}>
            <Typography variant="h6">
              Transfer ID
              <InfoTooltip
                title={
                  'Enter the origin transfer ID or transaction hash to relay'
                }
              />
              <Box ml={2} display="inline-flex">
                <Typography variant="body2" color="secondary" component="span">
                  Enter transfer ID or origin transaction hash
                </Typography>
              </Box>
            </Typography>
            <LargeTextField
              value={txHash}
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
    </Box>
  )
}
