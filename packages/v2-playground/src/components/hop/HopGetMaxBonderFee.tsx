import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton.js'
import { CustomTextField } from '../CustomTextField.js'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax.js'
import { useStyles } from '../useStyles.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useShared } from '../shared.js'

type Props = {
  sdk: Hop
}

export function HopGetMaxBonderFee (props: Props) {
  const cacheKey = 'hopGetMaxBonderFee'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString } = useShared()
  const [copied, setCopied] = useState(false)
  const [amountIn, setAmountIn] = useLocalStorageState(`${cacheKey}:amountIn`, {
    defaultValue: '',
  })

  const [maxBonderFee, setMaxBonderFee] = useLocalStorageState(`${cacheKey}:maxBonderFee`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setMaxBonderFee('')
      setLoading(true)
      const args = {
        amountIn
      }
      console.log('args', args)
      const fee = await sdk.getMaxBonderFee(args)
      setMaxBonderFee(fee?.toString())
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const amountIn = "${amountIn}"

  ${hopInstantiateDisplayString}
  const maxBonderFee = await hop.getMaxBonderFee({
    amountIn
  })
  console.log(maxBonderFee)
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
        <Typography variant="h5">Hop - Get Max Bonder Fee</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get maximum bonder fee for an amount</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Amount In <small><em>(uint256)</em></small> <small><em>Amount to calculate max bonder fee for</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="1000000" value={amountIn} onChange={event => setAmountIn(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Max Bonder Fee</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!maxBonderFee && (
            <Box mb={4}>
              <Alert severity="success">Max Bonder Fee: {maxBonderFee}</Alert>
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

export default HopGetMaxBonderFee 