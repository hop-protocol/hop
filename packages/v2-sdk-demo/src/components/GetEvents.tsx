import React, { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import { HighlightedButton } from './HighlightedButton'
import { CustomTextField } from './CustomTextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from './Syntax'
import { ChainSelect } from './ChainSelect'
import { useStyles } from './useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'

type Props = {
  sdk: Hop
}

export function GetEvents (props: Props) {
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [chainId, setChainId] = useState(() => {
    try {
      const cached = localStorage.getItem('getEvents:chainId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return '420'
  })
  const [startBlock, setStartBlock] = useState(() => {
    try {
      const cached = localStorage.getItem('getEvents:startBlock')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [endBlock, setEndBlock] = useState(() => {
    try {
      const cached = localStorage.getItem('getEvents:endBlock')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [events, setEvents] = useState('')
  const [loading, setLoading] = useState(false)
  const eventNames = useMemo(() => {
    return sdk?.getEventNames() ?? []
  }, [sdk])
  const [selectedEventNames, setSelectedEventNames] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('getEvents:selectedEventNames')
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (err: any) {}
    return [eventNames[0]]
  })
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('getEvents:selectedEventNames', JSON.stringify(selectedEventNames))
    } catch (err: any) {
      console.error(err)
    }
  }, [selectedEventNames])

  useEffect(() => {
    try {
      localStorage.setItem('getEvents:chainId', chainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [chainId])

  useEffect(() => {
    try {
      localStorage.setItem('getEvents:startBlock', startBlock)
    } catch (err: any) {
      console.error(err)
    }
  }, [startBlock])

  useEffect(() => {
    try {
      localStorage.setItem('getEvents:endBlock', endBlock)
    } catch (err: any) {
      console.error(err)
    }
  }, [endBlock])

  async function getEvents() {
    let _startBlock = Number(startBlock)
    let _endBlock = Number(endBlock)
    const provider = sdk.getRpcProvider(Number(chainId))
    const latestBlock = await provider.getBlockNumber()
    if (latestBlock) {
      if (!endBlock) {
        setEndBlock(latestBlock.toString())
        _endBlock = latestBlock
      }
      if (!startBlock) {
        const start = latestBlock - 1000
        setStartBlock(start.toString())
        _startBlock = start
      }
      if (_startBlock < 0) {
        _startBlock = _endBlock + _startBlock
        setStartBlock(_startBlock.toString())
      }
    }
    const args = {
      eventNames: selectedEventNames,
      chainId: Number(chainId),
      fromBlock: _startBlock,
      toBlock: _endBlock
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
  const chainId = ${chainId || 'undefined'}
  const fromBlock = ${startBlock || 'undefined'}
  const toBlock = ${endBlock || 'undefined'}

  const hop = new Hop('goerli')
  const events = await hop.getEvents({
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
        <Typography variant="h5">Get Events</Typography>
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
                  <label>Chain ID <small><em>(number)</em></small></label>
                </Box>
                {/*<CustomTextField fullWidth placeholder="420" value={chainId} onChange={event => setChainId(event.target.value)} />*/}
                <ChainSelect value={chainId} chains={['420', '5']} onChange={value => setChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From Block <small><em>(number)</em></small> <small><em>You can use negative value for number of blocks back of toBlock</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={startBlock} onChange={event => setStartBlock(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To Block <small><em>(number)</em></small> <small><em>Leave blank to use head block</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={endBlock} onChange={event => setEndBlock(event.target.value)} />
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
