import React, { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import { HighlightedButton } from '../HighlightedButton.js'
import { CustomTextField } from '../CustomTextField.js'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax.js'
import { ChainSelect } from '../ChainSelect.js'
import { useStyles } from '../useStyles.js'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useShared } from '../shared.js'

type Props = {
  sdk: Hop
}

export function GetEvents (props: Props) {
  const cacheKey = 'getEvents'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString, defaultChainIds, chainIds } = useShared()
  const [copied, setCopied] = useState(false)
  const [chainId, setChainId] = useLocalStorageState(`${cacheKey}:chainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [fromBlock, setFromBlock] = useLocalStorageState(`${cacheKey}:fromBlock`, {
    defaultValue: '',
  })

  const [toBlock, setToBlock] = useLocalStorageState(`${cacheKey}:toBlock`, {
    defaultValue: '',
  })

  const [events, setEvents] = useLocalStorageState(`${cacheKey}:events`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const eventNames = useMemo(() => {
    return sdk?.messenger.getEventNames() ?? []
  }, [sdk])
  const [error, setError] = useState('')

  const [selectedEventNames, setSelectedEventNames] = useLocalStorageState<string[]>(`${cacheKey}:selectedEventNames`, {
    defaultValue: [eventNames[0]],
  })

  async function getEvents() {
    let _fromBlock = Number(fromBlock)
    let _toBlock = Number(toBlock)
    const provider = sdk.getProvider(chainId)
    const latestBlock = await provider.getBlockNumber()
    if (latestBlock) {
      if (!toBlock) {
        setToBlock(latestBlock.toString())
        _toBlock = latestBlock
      }
      if (!fromBlock) {
        const start = latestBlock - 1000
        setFromBlock(start.toString())
        _fromBlock = start
      }
      if (_fromBlock < 0) {
        _fromBlock = _toBlock + _fromBlock
        setFromBlock(_fromBlock.toString())
      }
    }
    const args = {
      eventNames: selectedEventNames,
      chainId,
      fromBlock: _fromBlock,
      toBlock: _toBlock
    }
    console.log('args', args)
    const _events = await sdk.getEvents(args)
    return _events
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setEvents('')
      setLoading(true)
      const _events = await getEvents()
      setEvents(JSON.stringify(_events, null, 2))
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const eventNames = ${JSON.stringify(selectedEventNames)}
  const chainId = "${chainId}"
  const fromBlock = ${fromBlock || 'undefined'}
  const toBlock = ${toBlock || 'undefined'}

  ${hopInstantiateDisplayString}
  const events = await hop.messenger.getEvents({
    eventNames,
    chainId,
    fromBlock,
    toBlock
  })
  console.log(events)
}

main().catch(console.error)
`.trim()

  function handleCopy () {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5">Messenger - Get Events</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get decoded events for hub and spoke contracts</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Event names <small><em>(multiple selection allowed)</em></small></label>
                </Box>
                <select multiple value={selectedEventNames} onChange={event => setSelectedEventNames(Object.values(event.target.selectedOptions).map(x => x.value))} style={{ width: '100%', height: '200px' }}>
                  {eventNames.map((eventName: string) => {
                    return (
                      <option key={eventName} value={eventName}>{eventName}</option>
                    )
                  })}
                </select>
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uin256)</em></small></label>
                </Box>
                <ChainSelect value={chainId} chains={chainIds} onChange={value => setChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From Block <small><em>(number)</em></small> <small><em>You can use negative value for number of blocks back of toBlock</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={fromBlock} onChange={event => setFromBlock(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To Block <small><em>(number)</em></small> <small><em>Leave blank to use head block</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={toBlock} onChange={event => setToBlock(event.target.value)} />
              </Box>
              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get events</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!events && (
            <Box>
              <Box mb={2}>
                <Typography variant="body1">Output</Typography>
              </Box>
              <pre style={{
                maxWidth: '500px',
                overflow: 'auto'
              }}>{events}</pre>
              <CopyToClipboard text={events}
                onCopy={handleCopy}>
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </Typography>
              </CopyToClipboard>
            </Box>
          )}
        </Box>
        <Box width="100%" overflow="auto" className={styles.syntaxContainer}>
          <Box mb={2}>
            <Typography variant="subtitle1">Code example</Typography>
          </Box>
          <Box>
            <Syntax code={code} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default GetEvents
