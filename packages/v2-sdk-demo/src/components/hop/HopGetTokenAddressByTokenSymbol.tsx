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
import { ChainSelect } from '../ChainSelect.js'

type Props = {
  sdk: Hop
}

export function HopGetTokenAddressByTokenSymbol (props: Props) {
  const cacheKey = 'hopGetTokenAddressByTokenSymbol'
  const { sdk } = props
  const styles = useStyles()
  const { hopInstantiateDisplayString, chainIds, defaultChainIds } = useShared()
  const [copied, setCopied] = useState(false)
  const [address, setAddress] = useLocalStorageState(`${cacheKey}:address`, {
    defaultValue: '',
  })

  const [chainId, setChainId] = useLocalStorageState(`${cacheKey}:chainId`, {
    defaultValue: defaultChainIds.from,
  })

  const [tokenSymbol, setTokenSymbol] = useLocalStorageState(`${cacheKey}:tokenSymbol`, {
    defaultValue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setError('')
      setAddress('')
      setLoading(true)
      const args = {
        chainId,
        tokenSymbol
      }

      console.log('args', args)
      const result = sdk.getTokenAddressByTokenSymbol(chainId, tokenSymbol)
      setAddress(result)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  const code = `
import { Hop } from '@hop-protocol/v2-sdk'

async function main() {
  const chainId = "${chainId}"
  const tokenSymbol = "${tokenSymbol}"

  ${hopInstantiateDisplayString}
  const address = await hop.getTokenAddressByTokenSymbol(chainId, tokenSymbol)
  console.log(address)
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
        <Typography variant="h5">Hop - Get Token Address By Token Symbol</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Get token address by token symbol</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain Id <small><em>(uint256)</em></small> <small><em>Chain id value</em></small></label>
                </Box>
                <ChainSelect value={chainId} chains={chainIds} onChange={value => setChainId(value)} />
              </Box>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Token Symbol <small><em>(string)</em></small> <small><em>Token symbol</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="USDC" value={tokenSymbol} onChange={event => setTokenSymbol(event.target.value)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">Get Address</HighlightedButton>
              </Box>
            </form>
          </Box>
          {!!error && (
            <Box mb={4} width="100%" style={{ wordBreak: 'break-word' }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {!!address && (
            <Box mb={4}>
              <Alert severity="success">Address: {address}</Alert>
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

export default HopGetTokenAddressByTokenSymbol
