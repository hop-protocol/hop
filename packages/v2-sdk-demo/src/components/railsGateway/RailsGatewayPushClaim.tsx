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

export function RailsGatewayPushClaim (props: Props) {
  const cacheKey = 'railsGatewayPushClaim'
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

  const [to, setTo] = useLocalStorageState(`${cacheKey}:to`, {
    defaultValue: '',
  })

  const [amount, setAmount] = useLocalStorageState(`${cacheKey}:amount`, {
    defaultValue: '',
  })

  const [maxBonderFee, setMaxBonderFee] = useLocalStorageState(`${cacheKey}:maxBonderFee`, {
    defaultValue: '',
  })

  const [attestedClaimId, setAttestedClaimId] = useLocalStorageState(`${cacheKey}:attestedClaimId`, {
    defaultValue: '',
  })

  const [sourcePool, setSourcePool] = useLocalStorageState(`${cacheKey}:sourcePool`, {
    defaultValue: '',
  })

  const [nextHopsHash, setNextHopsHash] = useLocalStorageState(`${cacheKey}:nextHopsHash`, {
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
  const [txHash, setTxHash] = useState('')

  async function getSendTxData() {
    const args = {
      pathId,
      claimId,
      to,
      amount,
      maxBonderFee,
      attestedClaimId,
      sourcePool,
      nextHopsHash
    }
    console.log('args', args)
    const txData = await sdk.getRailsGateway(fromChainId).populateTransaction.pushClaim(args)
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
  const to = "${to}"
  const amount = "${amount}"
  const maxBonderFee = "${maxBonderFee}"
  const attestedClaimId = "${attestedClaimId}"
  const sourcePool = "${sourcePool}"
  const nextHopsHash = "${nextHopsHash}"

  ${hopInstantiateDisplayString}
  const txData = await hop.getRailsGateway('${fromChainId}').populateTransaction.pushClaim({
    pathId,
    claimId,
    to,
    amount,
    maxBonderFee,
    attestedClaimId,
    sourcePool,
    nextHopsHash
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
        <Typography variant="h5">Rails Gateway - Push Claim</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Push a claim to the RailsGateway contract</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(uint256)</em></small> <small><em>Destination chain ID of hop to push claim on</em></small></label>
                </Box>
                <ChainSelect value={fromChainId} chains={chainIds} onChange={value => setFromChainId(value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Path ID <small><em>(bytes32)</em></small> <small><em>Path ID from TransferSent event</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={pathId} onChange={(event: any) => setPathId(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Claim ID <small><em>(bytes32)</em></small> <small><em>The claim ID (transfer ID of TransferSent event)</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={claimId} onChange={(event: any) => setClaimId(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>To <small><em>(address)</em></small> <small><em>Original recipient address from TransferSent event</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={to} onChange={(event: any) => setTo(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Amount <small><em>(uint256)</em></small> <small><em>Original amount from TransferSent event</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={amount} onChange={(event: any) => setAmount(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Max Bonder Fee <small><em>(uint256)</em></small> <small><em>Max bonder fee from TransferSent event</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={maxBonderFee} onChange={(event: any) => setMaxBonderFee(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Attested Claim ID <small><em>(bytes32)</em></small> <small><em>Attested claim ID from TransferSent event</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={attestedClaimId} onChange={(event: any) => setAttestedClaimId(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Source Pool <small><em>(uint256)</em></small> <small><em>Source pool from TransferSent event</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={sourcePool} onChange={(event: any) => setSourcePool(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Next Hops Hash <small><em>(bytes32)</em></small> <small><em>Next hops hash computed from hops</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={nextHopsHash} onChange={(event: any) => setNextHopsHash(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Populate tx data only</label>
                </Box>
                <Checkbox checked={populateTxDataOnly} onChange={(event: any) => setPopulateTxDataOnly(event.target.checked)} />
              </Box>

              <Box mb={2} display="flex" justifyContent="center">
                {!signer && (
                  <HighlightedButton fullWidth variant="contained" size="large" onClick={() => requestWallet()}>Connect Wallet</HighlightedButton>
                )}
                {!!signer && (
                  <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">{populateTxDataOnly ? 'Get tx data' : 'Push Claim'}</HighlightedButton>
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

export default RailsGatewayPushClaim
