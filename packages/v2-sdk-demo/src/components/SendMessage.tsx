import React, { useState, useEffect, useMemo } from 'react'
import { Signer, providers } from 'ethers'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from './HighlightedButton'
import { CustomTextField } from './CustomTextField'
import { CustomTextArea } from './CustomTextArea'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from './Syntax'
import { ChainSelect } from './ChainSelect'
import { useStyles } from './useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AbiMethodForm } from './AbiMethodForm'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

type Props = {
  signer?: Signer
  sdk: Hop
  checkConnectedNetworkId: any
  requestWallet: any
}

export function SendMessage (props: Props) {
  const { signer, sdk, checkConnectedNetworkId, requestWallet } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useState(() => {
    try {
      const cached = localStorage.getItem('sendMessage:fromChainId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return '420'
  })
  const [toChainId, setToChainId] = useState(() => {
    try {
      const cached = localStorage.getItem('sendMessage:toChainId')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return '5'
  })
  const [toAddress, setToAddress] = useState(() => {
    try {
      const cached = localStorage.getItem('sendMessage:toAddress')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [toCalldata, setToCalldata] = useState(() => {
    try {
      const cached = localStorage.getItem('sendMessage:toCalldata')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [txData, setTxData] = useState('')
  const [populateTxDataOnly, setPopulateTxDataOnly] = useState(true)
  const [txHash, setTxHash] = useState('')
  const [messageId, setMessageId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [abiString, setAbiString] = useState(() => {
    try {
      const cached = localStorage.getItem('sendMessage:abiString')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [showAbiHelper, setShowAbiHelper] = useState(false)
  const [selectedAbiMethod, setSelectedAbiMethod] = useState(() => {
    try {
      const cached = localStorage.getItem('sendMessage:selectedAbiMethod')
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })

  const abiJson = useMemo(() => {
    try {
      let json = JSON.parse(abiString.trim())
      if (!Array.isArray(json)) {
        if (Array.isArray(json.abi)) {
          json = json.abi
        }
      }
      return json
    } catch (err) {}
    return []
  }, [abiString])

  const selectedAbiObj = useMemo(() => {
    const filtered = abiJson.filter((x: any) => x.name === selectedAbiMethod)
    return filtered[0]
  }, [abiJson, selectedAbiMethod])

  const provider = useMemo(() => {
    return sdk.getRpcProvider(Number(fromChainId))
  }, [sdk, fromChainId])

  const abiOptions = useMemo(() => {
    const options = abiJson
      .map((obj: any) => {
        const value = obj.type === 'function' ? obj.name : null
        let label = value
        if (value && obj.signature) {
          label = `${value} (${obj.signature})`
        }
        return {
          label,
          value
        }
      })
      .filter((x: any) => x.value)
    return options
  }, [abiJson])

  useEffect(() => {
    try {
      localStorage.setItem('sendMessage:fromChainId', fromChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromChainId])

  useEffect(() => {
    try {
      localStorage.setItem('sendMessage:toChainId', toChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [toChainId])

  useEffect(() => {
    try {
      localStorage.setItem('sendMessage:toAddress', toAddress)
    } catch (err: any) {
      console.error(err)
    }
  }, [toAddress])

  useEffect(() => {
    try {
      localStorage.setItem('sendMessage:toCalldata', toCalldata)
    } catch (err: any) {
      console.error(err)
    }
  }, [toCalldata])

  useEffect(() => {
    try {
      localStorage.setItem('sendMessage:abiString', abiString)
    } catch (err: any) {
      console.error(err)
    }
  }, [abiString])

  useEffect(() => {
    try {
      localStorage.setItem('sendMessage:selectedAbiMethod', selectedAbiMethod)
    } catch (err: any) {
      console.error(err)
    }
  }, [selectedAbiMethod])

  async function getSendTxData() {
    const args = {
      fromChainId: Number(fromChainId),
      toChainId: Number(toChainId),
      toAddress,
      toCalldata
    }
    console.log('args', args)
    const txData = await sdk.getSendMessagePopulatedTx(args)
    return txData
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setTxData('')
      setTxHash('')
      setMessageId('')
      setLoading(true)
      const txData = await getSendTxData()
      setTxData(JSON.stringify(txData, null, 2))
      const fee = await sdk.getMessageFee({ fromChainId: Number(fromChainId), toChainId: Number(toChainId) })
      if (!populateTxDataOnly) {
        if (!signer) {
          throw new Error('No signer')
        }
        await checkConnectedNetworkId(Number(fromChainId))
        const tx = await signer.sendTransaction({
          ...txData,
          value: fee
        })
        setTxHash(tx.hash)

        const receipt = await tx.wait()
        const { messageId } = await sdk.getMessageSentEventFromTransactionReceipt({ fromChainId: Number(fromChainId), receipt })
        setMessageId(messageId)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
${populateTxDataOnly ? `
import { Hop } from '@hop-protocol/v2-sdk'
`.trim() : `
import { Hop } from '@hop-protocol/v2-sdk'
import { ethers } from 'ethers'
`.trim()}

async function main() {
  const fromChainId = ${fromChainId || 'undefined'}
  const toChainId = ${toChainId || 'undefined'}
  const toAddress = "${toAddress}"
  const toCalldata = ${toCalldata ? `"${toCalldata}"` : 'undefined'}

  const hop = new Hop('goerli')
  const txData = await hop.getSendMessagePopulatedTx({
    fromChainId,
    toChainId,
    toAddress,
    toCalldata
  })
  ${populateTxDataOnly ? (
  'console.log(txData)'
  ) : (
  `
  const fee = await hop.getMessageFee(fromChainId, toChainId)
  const provider = new ethers.providers.Web3Provider(
    window.ethereum
  )
  const signer = provider.getSigner()
  const tx = await signer.sendTransaction({
    ...txData,
    value: fee
  })
  console.log(tx)
  `.trim()
  )}
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
        <Typography variant="h5">Send Message</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Send message to a destination chain</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>From Chain ID <small><em>(number)</em></small> <small><em>This is the origin chain the message will be sent from</em></small></label>
                </Box>
                {/*
                <TextField fullWidth placeholder="420" value={fromChainId} onChange={event => setFromChainId(event.target.value)} />
                */}
                <ChainSelect value={fromChainId} chains={['420', '5']} onChange={value => setFromChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To Chain ID <small><em>(number)</em></small> <small><em>This is the destination chain where the message should be received</em></small></label>
                </Box>
                {/*<TextField fullWidth placeholder="5" value={toChainId} onChange={event => setToChainId(event.target.value)} />*/}
                <ChainSelect value={toChainId} chains={['420', '5']} onChange={value => setToChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>To <small><em>(address)</em></small> <small><em>Address to call at the destination</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={toAddress} onChange={(event: any) => setToAddress(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box>
                  <Checkbox onChange={(event: any) => setShowAbiHelper(event.target.checked)} checked={showAbiHelper} />
                  <label>Use ABI Encoder Utility for Calldata</label>
                </Box>
              </Box>

              {showAbiHelper && (
                <Box mb={4} p={2} style={{ border: '1px dashed #ccc' }}>
                  <Box mb={2}>
                    <Box mb={1}>
                      <label>ABI <small><em>(JSON)</em></small> <small><em>This is the ABI JSON artifact that is generated when compiling contracts (e.g. ERC20.json)</em></small></label>
                    </Box>
                    <CustomTextArea minRows={5} maxRows={5} placeholder="[]" value={abiString} onChange={(event: any) => setAbiString(event.target.value)} style={{ width: '100%' }} />
                  </Box>
                  {abiOptions?.length > 0 && (
                    <Box mb={2}>
                      <Box mb={1}>
                        <label>Select Method</label>
                      </Box>

                      <Select
                        fullWidth
                        value={selectedAbiMethod}
                        onChange={(event: any) => setSelectedAbiMethod(event.target.value)}>
                        {abiOptions.map((x: any, i: number) => {
                          return (
                            <MenuItem key={i} value={x.value}>{x.label}</MenuItem>
                          )
                        })}
                      </Select>
                    </Box>
                  )}
                  <AbiMethodForm abi={selectedAbiObj} provider={provider} contractAddress={toAddress} onChange={(txData: any) => {
                    if (txData?.data) {
                      setToCalldata(txData.data)
                    } else {
                      setToCalldata('')
                    }
                  }} />
                </Box>
              )}

              <Box mb={2}>
                <Box mb={1}>
                  <label>Calldata <small><em>(hex string)</em></small> <small><em>{showAbiHelper ? 'This is the abi encoder calldata output which is the calldata to execute at the destination' : 'Calldata to execute at the destination'}</em></small></label>
                </Box>
                <CustomTextArea disabled={showAbiHelper} minRows={5} maxRows={5} placeholder="0x" value={toCalldata} onChange={(event: any) => setToCalldata(event.target.value)} style={{ width: '100%' }} />
              </Box>

              <Box mb={2}>
                <Box>
                  <Checkbox onChange={(event: any) => setPopulateTxDataOnly(event.target.checked)} checked={populateTxDataOnly} />
                  <label>Populate Tx Only</label>
                </Box>
              </Box>
              <Box mb={2} display="flex" justifyContent="center">
                {!signer && (
                  <HighlightedButton fullWidth variant="contained" size="large" onClick={() => requestWallet()}>Connect Wallet</HighlightedButton>
                )}
                {!!signer && (
                  <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">{populateTxDataOnly ? 'Get tx data' : 'Send'}</HighlightedButton>
                )}
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!txHash && (
            <Box mb={4}>
              <Alert severity="success">Tx hash: {txHash}</Alert>
            </Box>
          )}
          {!!messageId && (
            <Box mb={4}>
              <Alert severity="info">Message ID: {messageId}</Alert>
            </Box>
          )}
          {!!txData && (
            <Box>
              <Box mb={2}>
                <Typography variant="body1">Output</Typography>
              </Box>
              <pre style={{
                maxWidth: '500px',
                overflow: 'auto'
              }}>
                {txData}
              </pre>
              <CopyToClipboard text={txData}
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
