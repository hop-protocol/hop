import React, { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton'
import { CustomTextField } from '../CustomTextField'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { ChainSelect } from '../ChainSelect'
import { useStyles } from '../useStyles'
import { network, defaultChainIds, chainIds } from '../../config'

type Props = {
  sdk: Hop
}

export function RailsGatewayCalcAmountOutMin (props: Props) {
  const cacheKey = 'railsGatewayCalcAmountOutMin'
  const { sdk } = props
  const styles = useStyles()
  const [copied, setCopied] = useState(false)
  const [amountOut, setAmountOut] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:amountOut`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [slippageTolerance, setSlippageTolerance] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:slippageTolerance`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [amountOutMin, setAmountOutMin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:amountOut`, amountOut)
    } catch (err: any) {
      console.error(err)
    }
  }, [amountOut])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:slippageTolerance`, slippageTolerance)
    } catch (err: any) {
      console.error(err)
    }
  }, [slippageTolerance])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setAmountOutMin('')
      setLoading(true)
      const args = {
        amountOut,
        slippageTolerance: Number(slippageTolerance)
      }

      console.log('args', args)
      const result = sdk.railsGateway.calcAmountOutMin(args)
      setAmountOutMin(`${result.toString()}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const amountOut = "${amountOut}"
  const slippageTolerance = ${slippageTolerance}

  const hop = new Hop({ network: '${network}' })
  const amountOut = await hop.railsGateway.calcAmountOutMin({
    amountOut,
    slippageTolerance
  })
  console.log(amountOut)
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
        <Typography variant="h5">Rails Gateway - Calculate Amount Out Min</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get calculated amountOutMin</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Amount Out<small><em>(uint256)</em></small> <small><em>Amount out value</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="1000000" value={amountOut} onChange={event => setAmountOut(event.target.value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Slippage Tolerance <small><em>(number)</em></small> <small><em>Slippage tolerance percentage</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0.05" value={slippageTolerance} onChange={event => setSlippageTolerance(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Calculate</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!amountOutMin && (
            <Box mb={4}>
              <Alert severity="info">{amountOutMin}</Alert>
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
