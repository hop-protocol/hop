import React, { useState, useEffect } from 'react'
import { Signer } from 'ethers'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton'
import { CustomTextField } from '../CustomTextField'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { ChainSelect } from '../ChainSelect'
import { useStyles } from '../useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import { network, defaultChainIds, chainIds } from '../../config'

type Props = {
  signer?: Signer
  sdk: Hop
  requestWallet: any
}

export function RailsGatewayPostMultiHopClaim(props: Props) {
  const cacheKey = 'railsGatewayPostMultiHopClaim'
  const { signer, sdk, requestWallet } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:fromChainId`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return defaultChainIds.from
  })
  const [pathId, setPathId] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:pathId`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [transferId, setTransferId] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:transferId`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [amount, setAmount] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:amount`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [totalSent, setTotalSent] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:totalSent`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [toAddress, setToAddress] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:toAddress`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [index, setIndex] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:index`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [hops, setHops] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:hops`)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (err: any) {}
    return [{ pathId: '', minAmountOut: '', attestedCheckpoint: '' }]
  })
  const [txData, setTxData] = useState('')
  const [populateTxDataOnly, setPopulateTxDataOnly] = useState(true)
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:fromChainId`, fromChainId)
    } catch (err: any) {
      console.error(err)
    }
  }, [fromChainId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:hops`, JSON.stringify(hops))
    } catch (err: any) {
      console.error(err)
    }
  }, [hops])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:toAddress`, toAddress)
    } catch (err: any) {
      console.error(err)
    }
  }, [toAddress])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:amount`, amount)
    } catch (err: any) {
      console.error(err)
    }
  }, [amount])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:pathId`, pathId)
    } catch (err: any) {
      console.error(err)
    }
  }, [pathId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:transferId`, transferId)
    } catch (err: any) {
      console.error(err)
    }
  }, [transferId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:index`, index)
    } catch (err: any) {
      console.error(err)
    }
  }, [index])

  async function getSendTxData() {
    const args = {
      chainId: fromChainId,
      pathId,
      transferId,
      to: toAddress,
      amount,
      totalSent,
      index: Number(index),
      hops
    }
    console.log('args', args)
    const txData = await sdk.railsGateway.populateTransaction.postMultiHopClaim(args)
    return txData
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setTxData('')
      setTxHash('')
      setLoading(true)
      const txData = await getSendTxData()
      setTxData(JSON.stringify(txData, null, 2))
      if (!populateTxDataOnly) {
        if (!signer) {
          throw new Error('No signer')
        }
        const tx = await sdk.sendTransaction(txData)
        setTxHash(tx.hash)
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
  const pathId = "${pathId}"
  const transferId = "${transferId}"
  const to = "${toAddress}"
  const amount = "${amount}"
  const totalSent = "${totalSent}"
  const index = ${index !== '' ? index : '0'}
  const hops = "${JSON.stringify(hops, null, 2)}"

  const hop = new Hop({ network: '${network}' )
  const txData = await hop.railsGateway.populateTransaction.postMultiHopClaim({
    pathId,
    transferId,
    to,
    amount,
    totalSent,
    index,
    hops
  })
  ${populateTxDataOnly ? (
  'console.log(txData)'
  ) : (
  `
  const signer = window.ethereum
  const tx = await hop.connect(signer).sendTransaction(txData)
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
        <Typography variant="h5">Rails Gateway - Post Multi Hop Claim</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Post a multi hop claim</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uint256)</em></small> <small><em>This is the origin chain the transfer will be sent from</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Path ID <small><em>(bytes32)</em></small> <small><em>Path ID to use</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={pathId} onChange={(event: any) => setPathId(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Transfer ID <small><em>(bytes32)</em></small> <small><em>Transfer ID to use</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={transferId} onChange={(event: any) => setTransferId(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>To <small><em>(address)</em></small> <small><em>Recipient at the destination</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={toAddress} onChange={(event: any) => setToAddress(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Amount <small><em>(uint256)</em></small> <small><em>Amount to send</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={amount} onChange={(event: any) => setAmount(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Total Sent <small><em>(uint256)</em></small> <small><em>Total sent</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={totalSent} onChange={(event: any) => setTotalSent(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Index <small><em>(uint256)</em></small> <small><em>Index value</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={index} onChange={(event: any) => setIndex(event.target.value)} />
              </Box>

              <Stepper orientation="vertical">
                {hops.map((hop: any, index: number) => {
                  const { pathId, minAmountOut, attestedCheckpoint } = hop

                  function setHopPathId (value: string) {
                    const newHops = [...hops]
                    newHops[index].pathId = value
                    setHops(newHops)
                  }

                  function setMinAmountOut (value: string) {
                    const newHops = [...hops]
                    newHops[index].minAmountOut = value
                    setHops(newHops)
                  }

                  function setAttestedCheckpoint (value: string) {
                    const newHops = [...hops]
                    newHops[index].attestedCheckpoint = value
                    setHops(newHops)
                  }

                  return (
                  <Step key={index} active>
                    <StepLabel>Hop {'⤵'}</StepLabel>
                    <StepContent>
                    <Box>
                      <Box mb={2}>
                        <Typography variant="h6">Hop {index + 1}</Typography>
                      </Box>
                      <Box mb={2}>
                        <Box mb={1}>
                          <label>Path ID <small><em>(bytes32)</em></small> <small><em>Path ID to use</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0x" value={pathId} onChange={(event: any) => setHopPathId(event.target.value)} />
                      </Box>

                      <Box mb={2}>
                        <Box mb={1}>
                          <label>Min Amount Out <small><em>(uint256)</em></small> <small><em>Min amount out</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0" value={minAmountOut} onChange={(event: any) => setMinAmountOut(event.target.value)} />
                      </Box>

                      <Box mb={2}>
                        <Box mb={1}>
                          <label>Attested Checkpoint <small><em>(bytes32)</em></small> <small><em>Attested checkpoint to use</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0x" value={attestedCheckpoint} onChange={(event: any) => setAttestedCheckpoint(event.target.value)} />
                      </Box>

                      {hops.length !== 1 && (
                        <Box mb={2}>
                          <Button onClick={() => {
                            const newHops = [...hops]
                            newHops.splice(index, 1)
                            setHops(newHops)
                          }}>Remove</Button>
                        </Box>
                      )}
                    </Box>
                    </StepContent>
                  </Step>
                  )
                })}
              </Stepper>

              <Box mb={2}>
                <HighlightedButton onClick={() => setHops([...hops, { pathId: '', minAmountOut: '', attestedCheckpoint: '' }])} variant="outlined">Add Hop</HighlightedButton>
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
