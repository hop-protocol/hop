import React, { useState, useEffect, useMemo } from 'react'
import { Signer, providers } from 'ethers'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { HighlightedButton } from '../HighlightedButton'
import { CustomTextField } from '../CustomTextField'
import { CustomTextArea } from '../CustomTextArea'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { Hop } from '@hop-protocol/v2-sdk'
import { Syntax } from '../Syntax'
import { ChainSelect } from '../ChainSelect'
import { useStyles } from '../useStyles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AbiMethodForm } from '../AbiMethodForm'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { network, defaultChainIds, chainIds } from '../../config'

type Props = {
  signer?: Signer
  sdk: Hop
  checkConnectedNetworkId: any
  requestWallet: any
}

export function RailsGatewayBond (props: Props) {
  const cacheKey = 'railsGatewayBond'
  const { signer, sdk, checkConnectedNetworkId, requestWallet } = props
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
  const [checkpoint, setCheckpoint] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:checkpoint`)
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
  const [nonce, setNonce] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:nonce`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
  })
  const [attestedCheckpoint, setAttestedCheckpoint] = useState(() => {
    try {
      const cached = localStorage.getItem(`${cacheKey}:attestedCheckpoint`)
      if (cached) {
        return cached
      }
    } catch (err: any) {}
    return ''
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
      localStorage.setItem(`${cacheKey}:pathId`, pathId)
    } catch (err: any) {
      console.error(err)
    }
  }, [pathId])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:checkpoint`, checkpoint)
    } catch (err: any) {
      console.error(err)
    }
  }, [checkpoint])

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
      localStorage.setItem(`${cacheKey}:totalSent`, totalSent)
    } catch (err: any) {
      console.error(err)
    }
  }, [totalSent])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:nonce`, nonce)
    } catch (err: any) {
      console.error(err)
    }
  }, [nonce])

  useEffect(() => {
    try {
      localStorage.setItem(`${cacheKey}:attestedCheckpoint`, attestedCheckpoint)
    } catch (err: any) {
      console.error(err)
    }
  }, [attestedCheckpoint])

  async function getSendTxData() {
    const args = {
      chainId: Number(fromChainId),
      pathId,
      checkpoint,
      to: toAddress,
      amount,
      totalSent,
      nonce,
      attestedCheckpoint
    }
    console.log('args', args)
    const txData = await sdk.railsGateway.populateTransaction.bond(args)
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
        await checkConnectedNetworkId(Number(fromChainId))
        const tx = await signer.sendTransaction({
          ...txData
        })
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
  const chainId = ${fromChainId || 'undefined'}
  const pathId = "${pathId}"
  const checkpoint = "${checkpoint}"
  const to = "${toAddress}"
  const amount = "${amount}"
  const totalSent = "${totalSent}"
  const nonce = "${nonce}"
  const attestedCheckpoint = "${attestedCheckpoint}"

  const hop = new Hop({ network: '${network}' )
  const txData = await hop.railsGateway.populateTransaction.bond({
    chainId,
    pathId,
    checkpoint,
    to,
    amount,
    totalSent,
    nonce,
    attestedCheckpoint
  })
  ${populateTxDataOnly ? (
  'console.log(txData)'
  ) : (
  `
  const provider = new ethers.providers.Web3Provider(
    window.ethereum
  )
  const signer = provider.getSigner()
  const tx = await signer.sendTransaction({
    ...txData,
    value: fee
  })
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
        <Typography variant="h5">Rails Hub - Bond</Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="subtitle1">Bond tokens at the destination chain</Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="space-between" className={styles.container}>
        <Box mr={4} className={styles.formContainer}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Box mb={1}>
                  <label>Chain ID <small><em>(number)</em></small> <small><em>This is the origin chain the transfer will be sent from</em></small></label>
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
                  <label>Checkpoint <small><em>(bytes32)</em></small> <small><em>Checkpoint hash</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={checkpoint} onChange={(event: any) => setCheckpoint(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>To <small><em>(address)</em></small> <small><em>Recipient at the destination</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={toAddress} onChange={(event: any) => setToAddress(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Total Sent <small><em>(uint256)</em></small> <small><em>Total sent</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={totalSent} onChange={(event: any) => setTotalSent(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Nonce <small><em>(uint256)</em></small> <small><em>Nonce value</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0" value={nonce} onChange={(event: any) => setNonce(event.target.value)} />
              </Box>

              <Box mb={2}>
                <Box mb={1}>
                  <label>Attested Checkpoint <small><em>(bytes32)</em></small> <small><em>Attested checkpoint to use</em></small></label>
                </Box>
                <CustomTextField fullWidth placeholder="0x" value={attestedCheckpoint} onChange={(event: any) => setAttestedCheckpoint(event.target.value)} />
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
                  <HighlightedButton loading={loading} fullWidth type="submit" variant="contained" size="large">{populateTxDataOnly ? 'Get tx data' : 'Bond'}</HighlightedButton>
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
