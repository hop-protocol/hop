import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton.js'
import { CustomTextField } from '../CustomTextField.js'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax.js'
import { ChainSelect } from '../ChainSelect.js'
import { useStyles } from '../useStyles.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useShared } from '../shared.js'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepContent from '@mui/material/StepContent'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'

type Props = {
  sdk: Hop
}

type HopInput = {
  pathId: string
  maxBonderFee: string
  maxTotalSent: string
  attestedClaimId: string
}

export function RailsGatewayGetNextHopsHash (props: Props) {
  const cacheKey = 'railsGatewayGetNextHopsHash'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString, defaultChainIds, chainIds } = useShared()
  const [fromChainId, setFromChainId] = useLocalStorageState(`${cacheKey}:fromChainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [nextHops, setNextHops] = useLocalStorageState<HopInput[]>(`${cacheKey}:nextHops`, {
    defaultValue: [{
      pathId: '',
      maxBonderFee: '',
      maxTotalSent: '',
      attestedClaimId: ''
    }],
  })

  const [nextHopsHash, setNextHopsHash] = useLocalStorageState(`${cacheKey}:nextHopsHash`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addHop = () => {
    setNextHops([...nextHops, {
      pathId: '',
      maxBonderFee: '',
      maxTotalSent: '',
      attestedClaimId: ''
    }])
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setNextHopsHash('')
      setLoading(true)

      const hash = await sdk.getRailsGateway(fromChainId).getNextHopsHash({
        nextHops: nextHops
      })

      setNextHopsHash(hash)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const nextHops = ${JSON.stringify(nextHops, null, 2)}

  ${hopInstantiateDisplayString}
  const hash = await hop.getRailsGateway('${fromChainId}').getNextHopsHash({
    nextHops
  })
  console.log(hash)
}

main().catch(console.error)
`.trim()

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5">Rails Gateway - Get Next Hops Hash</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get the hash of the next hops array</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uint256)</em></small> <small><em>Chain to read from</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>

              <Stepper orientation="vertical">
                {nextHops.map((hop, index) => {
                  const { pathId, maxBonderFee, maxTotalSent, attestedClaimId } = hop

                  function setHopPathId (value: string) {
                    const newHops = [...nextHops]
                    newHops[index].pathId = value
                    setNextHops(newHops)
                  }

                  function setHopMaxBonderFee (value: string) {
                    const newHops = [...nextHops]
                    newHops[index].maxBonderFee = value
                    setNextHops(newHops)
                  }

                  function setHopMaxTotalSent (value: string) {
                    const newHops = [...nextHops]
                    newHops[index].maxTotalSent = value
                    setNextHops(newHops)
                  }

                  function setHopAttestedClaimId (value: string) {
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
                            <CustomTextField fullWidth placeholder="0x" value={pathId} onChange={(event) => setHopPathId(event.target.value)} />
                          </Box>

                          <Box mb={2}>
                            <Box mb={1}>
                              <label>Max Bonder Fee <small><em>(uint256)</em></small> <small><em>Maximum fee for the bonder</em></small></label>
                            </Box>
                            <CustomTextField fullWidth placeholder="0" value={maxBonderFee} onChange={(event) => setHopMaxBonderFee(event.target.value)} />
                          </Box>

                          <Box mb={2}>
                            <Box mb={1}>
                              <label>Max Total Sent <small><em>(uint256)</em></small> <small><em>Maximum total amount sent</em></small></label>
                            </Box>
                            <CustomTextField fullWidth placeholder="0" value={maxTotalSent} onChange={(event) => setHopMaxTotalSent(event.target.value)} />
                          </Box>

                          <Box mb={2}>
                            <Box mb={1}>
                              <label>Attested Claim ID <small><em>(bytes32)</em></small> <small><em>Attested claim ID</em></small></label>
                            </Box>
                            <CustomTextField fullWidth placeholder="0x" value={attestedClaimId} onChange={(event) => setHopAttestedClaimId(event.target.value)} />
                          </Box>

                          {nextHops.length > 1 && (
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

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Next Hops Hash</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!nextHopsHash && (
            <Box mb={4}>
              <Alert severity="success">Next Hops Hash: {nextHopsHash}</Alert>
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

export default RailsGatewayGetNextHopsHash 