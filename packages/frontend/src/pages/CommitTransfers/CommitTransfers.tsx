import Box from '@mui/material/Box'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import useQueryParams from '#hooks/useQueryParams.js'
import { Alert } from '#components/Alert/index.js'
import { Button } from '#components/Button/Button.js'
import { formatError } from '#utils/format.js'
import { makeStyles } from '@mui/styles'
import { reactAppNetwork } from '#config/index.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import RaisedSelect from '#components/selects/RaisedSelect.js'
import MenuItem from '@mui/material/MenuItem'
import Link from '@mui/material/Link'
import SelectOption from '#components/selects/SelectOption.js'
import { l2Networks, allNetworks } from '#config/networks.js'
import Network from '#models/Network.js'
import { findNetworkBySlug, findMatchingBridge } from '#utils/index.js'

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

export const CommitTransfers: FC = () => {
  const styles = useStyles()
  const { sdk, networks, txConfirm, bridges, selectedBridge, setSelectedBridge } = useApp()
  const { checkConnectedNetworkId } = useWeb3Context()
  const { queryParams } = useQueryParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [commitInfoMsg, setCommitInfoMsg] = useState<string>('')
  const [selectedFromNetwork, setSelectedFromNetwork] = useState<Network>(() => {
    try {
      const selectedFromNetworkSlug = localStorage.getItem('commitTransfers:selectedFromNetwork')
      if (selectedFromNetworkSlug) {
        const network = findNetworkBySlug(selectedFromNetworkSlug, l2Networks)
        if (network) {
          return network
        }
      }
    } catch (err: any) {
    }
    return l2Networks[0]
  })

  const [selectedToNetwork, setSelectedToNetwork] = useState<Network>(() => {
    try {
      const selectedToNetworkSlug = localStorage.getItem('commitTransfers:selectedToNetwork')
      if (selectedToNetworkSlug) {
        const network = findNetworkBySlug(selectedToNetworkSlug, allNetworks)
        if (network) {
          return network
        }
      }
    } catch (err: any) {
    }
    return allNetworks[0]
  })

  useEffect(() => {
    try {
      localStorage.setItem('commitTransfers:selectedFromNetwork', selectedFromNetwork?.slug ?? '')
    } catch (err: any) {
      console.error(err)
    }
  }, [selectedFromNetwork])

  useEffect(() => {
    try {
      localStorage.setItem('commitTransfers:selectedToNetwork', selectedToNetwork?.slug ?? '')
    } catch (err: any) {
      console.error(err)
    }
  }, [selectedToNetwork])

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
      setCommitInfoMsg('')
      await new Promise((resolve, reject) => {
        const run = async () => {
          console.log('selectedFromNetwork', selectedFromNetwork)
          const l2Wallet = await sdk.getSignerOrProvider(selectedFromNetwork.slug)
          const token = selectedBridge.getTokenSymbol()
          console.log('reactAppNetwork', reactAppNetwork)
          console.log('l2Wallet', l2Wallet)
          console.log('token', token)
          const commitTxHash = '' // for debugging
          if (!commitTxHash) {
            const bridge = sdk.bridge(token)
            const isNetworkConnected = await checkConnectedNetworkId(selectedFromNetwork.networkId)
            if (!isNetworkConnected) {
              throw new Error('wrong network connected')
            }
            const tx = await bridge.commitTransfers(selectedFromNetwork.slug, selectedToNetwork.slug)
            console.log('commitTxHash', tx.hash)
            setCommitInfoMsg(`Commit transfers transaction hash: ${tx.hash}`)
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

  return (
    <Box className={styles.root}>
      <Box className={styles.header}>
        <Typography variant="h4">Commit Transfers</Typography>
      </Box>
      <Box mb={4} justifyItems="center" style={{ opacity: 0.7 }}>
        <Typography variant="body1">This is to commit the transfer root hash which is necessary for manually withdrawals.</Typography>
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

              <RaisedSelect value={selectedFromNetwork?.slug} onChange={(event: any) => {
                const selectedFromNetworkSlug = event.target.value as string
                setSelectedFromNetwork(findNetworkBySlug(selectedFromNetworkSlug, l2Networks))
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

              <RaisedSelect value={selectedToNetwork?.slug} onChange={(event: any) => {
                const selectedToNetworkSlug = event.target.value as string
                setSelectedToNetwork(findNetworkBySlug(selectedToNetworkSlug, allNetworks))
              }}>
                {allNetworks.map(network => (
                  <MenuItem value={network.slug} key={network.slug}>
                    <SelectOption value={network.slug} icon={network.imageUrl} label={network.name} />
                  </MenuItem>
                ))}
              </RaisedSelect>

            </Box>
          </Box>

        </Box>
        <Box>
          <Button onClick={handleSubmit} loading={loading} large highlighted>
            Commit Transfers
          </Button>
        </Box>
      </form>
      <Box className={styles.notice} mb={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
      <Box className={styles.notice} mb={2}>
        <Alert severity="success">{success}</Alert>
      </Box>
      {commitInfoMsg && (
        <Box className={styles.notice} mb={2}>
          <Alert severity="success">{commitInfoMsg}</Alert>
        </Box>
      )}
      <Box mt={10} display="flex" justifyContent="center" style={{ opacity: 0.7 }}>
        <Typography variant="body1">After the transfer root has been committed, the transfer can be relayed using the <Link href="#/relay">Relay page</Link>.</Typography>
      </Box>
    </Box>
  )
}
