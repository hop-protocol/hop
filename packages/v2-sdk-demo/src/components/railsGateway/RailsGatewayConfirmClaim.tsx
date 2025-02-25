import React, { useState } from 'react'
import { Signer } from 'ethers'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton.js'
import { CustomTextField } from '../CustomTextField.js'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax.js'
import { ChainSelect } from '../ChainSelect.js'
import { useStyles } from '../useStyles.js'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useShared } from '../shared.js'

type Props = {
  signer?: Signer
  sdk: Hop
  requestWallet: any
}

export function RailsGatewayConfirmClaim (props: Props) {
  const cacheKey = 'railsGatewayConfirmClaim'
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

  const [claimId, setClaimId] = useLocalStorageState(`${cacheKey}:claimId`, {
    defaultValue: '',
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
      claimId
    }
    console.log('args', args)
    const txData = await sdk.getRailsGateway(fromChainId).populateTransaction.confirmClaim(args)
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

  const code = `
${populateTxDataOnly ? `
import { Hop } from '@hop-protocol/v2-sdk'
`.trim() : `
import { Hop } from '@hop-protocol/v2-sdk'
import { ethers } from 'ethers'
`.trim()}

async function main() {
  const pathId = "${pathId}"
  const claimId = "${claimId}"

  ${hopInstantiateDisplayString}
  const txData = await hop.getRailsGateway('${fromChainId}').populateTransaction.confirmClaim({
    pathId,
    claimId
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
        <Typography variant="h5">Rails Gateway - Confirm Claim</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Confirm claim ID</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uint256)</em></small> <small><em>This is the chain to confirm claim on</em></small></label>
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
                  <label>Transfer ID <small><em>(bytes32)</em></small> <small><em>The transfer ID of the claim</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={claimId} onChange={(event: any) => setClaimId(event.target.value)} />
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
                  <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">{populateTxDataOnly ? 'Get tx data' : 'Confirm Claim'}</HighlightedButton>
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

export default RailsGatewayConfirmClaim
