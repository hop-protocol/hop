import React, { useState } from 'react'
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
import { network, defaultChainIds, chainIds } from '../../config'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'

type Props = {
  signer?: Signer
  sdk: Hop
  requestWallet: any
}

export function RailsGatewaySend (props: Props) {
  const cacheKey = 'railsGatewaySend'
  const { signer, sdk, requestWallet } = props
  const styles = useStyles()
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

  const [maxTotalSent, setMaxTotalSent] = useLocalStorageState(`${cacheKey}:maxTotalSent`, {
    defaultValue: '',
  })

  const [nextHops, setNextHops] = useLocalStorageState(`${cacheKey}:nextHops`, {
    defaultValue: [{ pathId: '', maxTotalSent: '', attestedClaimId: '' }],
  })

  const [txData, setTxData] = useState('')
  const [populateTxDataOnly, setPopulateTxDataOnly] = useState(true)
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function getSendTxData() {
    const args = {
      chainId: fromChainId,
      pathId,
      to: toAddress,
      amount,
      attestedClaimId,
      nextHops,
      maxTotalSent
    }
    console.log('args', args)
    const txData = await sdk.railsGateway.populateTransaction.send(args)
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

  function addHop() {
    setNextHops([...nextHops, { pathId: '', maxTotalSent: '', attestedClaimId: '' }])
  }

  const code = `
${populateTxDataOnly ? `
import { Hop } from '@hop-protocol/v2-sdk'
`.trim() : `
import { Hop } from '@hop-protocol/v2-sdk'
import { ethers } from 'ethers'
`.trim()}

async function main() {
  const chainId = "${fromChainId}"
  const pathId = "${pathId}"
  const to = "${toAddress}"
  const amount = "${amount}"
  const attestedClaimId = "${attestedClaimId}"
  const nextHops = ${JSON.stringify(nextHops, null, 2)}
  const maxTotalSent = "${maxTotalSent}"

  const hop = new Hop({ network: '${network}' )
  const txData = await hop.railsGateway.populateTransaction.send({
    chainId,
    pathId,
    to,
    amount,
    attestedClaimId,
    nextHops,
    maxTotalSent
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
                  <label>Max Total Sent <small><em>(uint256)</em></small> <small><em>Max total sent</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={maxTotalSent} onChange={(event: any) => setMaxTotalSent(event.target.value)} />
              </Box>

              <Stepper orientation="vertical">
                {nextHops.map((hop: any, index: number) => {
                  const { pathId, maxTotalSent, attestedClaimId } = hop

                  function setHopPathId (value: string) {
                    const newHops = [...nextHops]
                    newHops[index].pathId = value
                    setNextHops(newHops)
                  }

                  function setHopMaxTotalSent (value: string) {
                    const newHops = [...nextHops]
                    newHops[index].maxTotalSent = value
                    setNextHops(newHops)
                  }

                  function setHopAttestedClaimId  (value: string) {
                    const newHops = [...nextHops]
                    newHops[index].attestedClaimId = value
                    setNextHops(newHops)
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
                          <label>Max Total Sent <small><em>(uint256)</em></small> <small><em>Max total sent</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0" value={maxTotalSent} onChange={(event: any) => setHopMaxTotalSent(event.target.value)} />
                      </Box>

                      <Box mb={2}>
                        <Box mb={1}>
                          <label>Attested Claim ID <small><em>(bytes32)</em></small> <small><em>Attested claim ID</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0x" value={attestedClaimId} onChange={(event: any) => setHopAttestedClaimId(event.target.value)} />
                      </Box>

                      {nextHops.length !== 0 && (
                        <Box mb={2}>
                          <Button onClick={() => {
                            const newHops = [...nextHops]
                            newHops.splice(index, 1)
                            setNextHops(newHops)
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
