import React, { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Step from '@mui/material/Step'
import StepContent from '@mui/material/StepContent'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { ChainSelect } from '../ChainSelect.js'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CustomTextField } from '../CustomTextField.js'
import { HighlightedButton } from '../HighlightedButton.js'
import { Hop } from '@hop-protocol/v2-sdk'
import { Signer } from 'ethers'
import { Syntax } from '../Syntax.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useStyles } from '../useStyles.js'
import { useShared } from '../shared.js'

type Props = {
  signer?: Signer
  sdk: Hop
  requestWallet: any
}

export function RailsGatewaySend (props: Props) {
  const cacheKey = 'railsGatewaySend'
  const { signer, sdk, requestWallet } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString, defaultChainIds, chainIds } = useShared()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [pathId, setPathId] = useLocalStorageState(`${cacheKey}:pathId`, {
    defaultValue: '',
  })

  const [toAddress, setToAddress] = useLocalStorageState(`${cacheKey}:toAddress`, {
    defaultValue: '',
  })

  const [amount, setAmount] = useLocalStorageState(`${cacheKey}:amount`, {
    defaultValue: '',
  })

  const [attestedClaimId, setAttestedClaimId] = useLocalStorageState(`${cacheKey}:attestedClaimId`, {
    defaultValue: '',
  })

  const [fee, setFee] = useLocalStorageState(`${cacheKey}:fee`, {
    defaultValue: '',
  })

  const [hops, setHops] = useLocalStorageState(`${cacheKey}:hops`, {
    defaultValue: [{ pathId: '', maxBonderFee: '', minAmountOut: '', attestedClaimId: '' }],
  })

  const [txHash, setTxHash] = useLocalStorageState(`${cacheKey}:txHash`, {
    defaultValue: '',
  })

  const [txData, setTxData] = useLocalStorageState(`${cacheKey}:txData`, {
    defaultValue: '',
  })

  const [populateTxDataOnly, setPopulateTxDataOnly] = useLocalStorageState(`${cacheKey}:populateTxDataOnly`, {
    defaultValue: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function getSendTxData() {
    const args = {
      pathId,
      to: toAddress,
      amount,
      hops,
      fee
    }
    console.log('args', args)
    const txData = await sdk.getRailsGateway(fromChainId).populateTransaction.send(args)
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
        const tx = await sdk.sendTransaction(txData, txData.chainId, signer)
        setTxHash(tx.hash)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  function addHop() {
    setHops([...hops, { pathId: '', maxBonderFee: '', minAmountOut: '', attestedClaimId: '' }])
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
  const to = "${toAddress}"
  const amount = "${amount}"
  const hops = ${JSON.stringify(hops, null, 2)}
  const fee = "${fee}"

  ${hopInstantiateDisplayString}
  const txData = await hop.getRailsGateway('${fromChainId}').populateTransaction.send({
    pathId,
    to,
    amount,
    hops,
    fee
  })
  ${populateTxDataOnly ? (
  'console.log(txData)'
  ) : (
  `
  const signer = window.ethereum
  const tx = await signer.sendTransaction(txData)
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
        <Typography variant="h5">Rails Gateway - Send</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Send tokens to a destination chain</Typography>
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
                  <label>Attested Claim ID <small><em>(bytes32)</em></small> <small><em>Attested Claim ID</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={attestedClaimId} onChange={(event: any) => setAttestedClaimId(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Fee <small><em>(uint256)</em></small> <small><em>Message fee</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={fee} onChange={(event: any) => setFee(event.target.value)} />
              </Box>

              <Stepper orientation="vertical">
                {hops.map((hop: any, index: number) => {
                  const { pathId, minAmountOut, maxBonderFee, attestedClaimId } = hop

                  function setHopPathId (value: string) {
                    const newHops = [...hops]
                    newHops[index].pathId = value
                    setHops(newHops)
                  }

                  function setHopMaxBonderFee (value: string) {
                    const newHops = [...hops]
                    newHops[index].maxBonderFee = value
                    setHops(newHops)
                  }

                  function setHopMinAmountOut (value: string) {
                    const newHops = [...hops]
                    newHops[index].minAmountOut = value
                    setHops(newHops)
                  }

                  function setHopAttestedClaimId  (value: string) {
                    const newHops = [...hops]
                    newHops[index].attestedClaimId = value
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
                          <label>Max Bonder Fee <small><em>(uint256)</em></small> <small><em>Max bonder fee</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0" value={maxBonderFee} onChange={(event: any) => setHopMaxBonderFee(event.target.value)} />
                      </Box>

                      <Box mb={2}>
                        <Box mb={1}>
                          <label>Max Total Sent <small><em>(uint256)</em></small> <small><em>Max total sent</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0" value={minAmountOut} onChange={(event: any) => setHopMinAmountOut(event.target.value)} />
                      </Box>

                      <Box mb={2}>
                        <Box mb={1}>
                          <label>Attested Claim ID <small><em>(bytes32)</em></small> <small><em>Attested claim ID</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0x" value={attestedClaimId} onChange={(event: any) => setHopAttestedClaimId(event.target.value)} />
                      </Box>

                      {hops.length !== 0 && (
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
                <HighlightedButton variant="contained" color="primary" onClick={addHop}>
                  Add Hop
                </HighlightedButton>
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

export default RailsGatewaySend
