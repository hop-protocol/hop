import React, { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepContent from '@mui/material/StepContent'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { ChainSelect } from '../ChainSelect.js'
import { CustomTextField } from '../CustomTextField.js'
import { HighlightedButton } from '../HighlightedButton.js'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useStyles } from '../useStyles.js'
import { useShared } from '../shared.js'

type Props = {
  sdk: Hop
}

export function RailsGatewayGetTransferDataHash (props: Props) {
  const cacheKey = 'railsGatewayGetTransferDataHash'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString, defaultChainIds, chainIds } = useShared()
  const [copied, setCopied] = useState(false)
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [toAddress, setToAddress] = useLocalStorageState(`${cacheKey}:toAddress`, {
    defaultValue: '',
  })

  const [amountOut, setAmountOut] = useLocalStorageState(`${cacheKey}:amountOut`, {
    defaultValue: '',
  })

  const [sourcePool, setSourcePool] = useLocalStorageState(`${cacheKey}:sourcePool`, {
    defaultValue: '',
  })

  const [hops, setHops] = useLocalStorageState(`${cacheKey}:hops`, {
    defaultValue: [{ pathId: '', maxBonderFee: '', maxTotalSent: '', attestedClaimId: '' }],
  })

  const [transferDataHash, setTransferDataHash] = useLocalStorageState(`${cacheKey}:transferDataHash`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setTransferDataHash('')
      setLoading(true)
      const args = {
        to: toAddress,
        amountOut,
        sourcePool,
        hops,
      }
      console.log('args', args)
      const hash = await sdk.getRailsGateway(fromChainId).getTransferDataHash(args)
      setTransferDataHash(hash)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  function addHop() {
    setHops([...hops, { pathId: '', maxBonderFee: '', maxTotalSent: '', attestedClaimId: '' }])
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const to = "${toAddress}"
  const amountOut = "${amountOut}"
  const sourcePool = "${sourcePool}"
  const hops = ${JSON.stringify(hops, null, 2)}

  ${hopInstantiateDisplayString}
  const transferDataHash = await hop.getRailsGateway('${fromChainId}').getTransferDataHash({
    to,
    amountOut,
    sourcePool,
    hops,
  })

  console.log(transferDataHash)
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
        <Typography variant="h5">Rails Gateway - Get Transfer Data Hash</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get Transfer Data Hash from Hops struct array</Typography>
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
                  <label>To <small><em>(address)</em></small> <small><em>The destination address</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={toAddress} onChange={(event: any) => setToAddress(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Amount Out <small><em>(uint256)</em></small> <small><em>Amount to be received at destination</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={amountOut} onChange={(event: any) => setAmountOut(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Source Pool <small><em>(uint256)</em></small> <small><em>Source pool amount</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={sourcePool} onChange={(event: any) => setSourcePool(event.target.value)} />
              </Box>

              <Stepper orientation="vertical">
                {hops.map((hop: any, index: number) => {
                  const { pathId, maxTotalSent, maxBonderFee, attestedClaimId } = hop

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

                  function setHopMaxTotalSent (value: string) {
                    const newHops = [...hops]
                    newHops[index].maxTotalSent = value
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
                          <label>Max Bonder Fee <small><em>(uint256)</em></small> <small><em>Maximum fee for the bonder</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0" value={maxBonderFee} onChange={(event: any) => setHopMaxBonderFee(event.target.value)} />
                      </Box>

                      <Box mb={2}>
                        <Box mb={1}>
                          <label>Max Total Sent <small><em>(uint256)</em></small> <small><em>Maximum total amount sent</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0" value={maxTotalSent} onChange={(event: any) => setHopMaxTotalSent(event.target.value)} />
                      </Box>

                      <Box mb={2}>
                        <Box mb={1}>
                          <label>Attested Claim ID <small><em>(bytes32)</em></small> <small><em>ID of the attested claim</em></small></label>
                        </Box>
                        <CustomTextField fullWidth placeholder="0x" value={attestedClaimId} onChange={(event: any) => setHopAttestedClaimId(event.target.value)} />
                      </Box>

                      {hops.length !== 0 && (
                        <Box mb={2}>
                          <Button onClick={() => {
                            const newHops = [...hops]
                            newHops.splice(index, 1)
                            setHops(newHops)
                          }}>Remove Hop</Button>
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

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Hash</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!transferDataHash && (
            <Box mb={4}>
              <Alert severity="success">Hash: {transferDataHash}</Alert>
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

export default RailsGatewayGetTransferDataHash
