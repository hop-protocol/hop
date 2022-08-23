import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useInterval } from 'react-use'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow as theme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { providers } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Hop } from '@hop-protocol/sdk'
import './App.css'

function TokenDropdown (props: any) {
  const { label, value, handleChange } = props
  return (
    <FormControl fullWidth>
      <InputLabel id="select-label">{label}</InputLabel>
      <Select
        labelId="select-label"
        id="simple-select"
        value={value}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="USDC">USDC</MenuItem>
        <MenuItem value="USDT">USDT</MenuItem>
        <MenuItem value="DAI">DAI</MenuItem>
        <MenuItem value="ETH">ETH</MenuItem>
      </Select>
    </FormControl>
  )
}

function ChainDropdown (props: any) {
  const { label, value, handleChange } = props
  return (
    <FormControl fullWidth>
      <InputLabel id="select-label">{label}</InputLabel>
      <Select
        labelId="select-label"
        id="simple-select"
        value={value}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="ethereum">Ethereum</MenuItem>
        <MenuItem value="arbitrum">Arbitrum</MenuItem>
        <MenuItem value="optimism">Optimism</MenuItem>
        <MenuItem value="polygon">Polygon</MenuItem>
        <MenuItem value="gnosis">Gnosis</MenuItem>
      </Select>
    </FormControl>
  )
}

function App () {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [address, setAddress] = useState('')
  const [nativeTokenBalance, setNativeTokenBalance] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [signer, setSigner] = useState<any>(null)
  const [provider] = useState(() => {
    try {
      return new providers.Web3Provider((window as any).ethereum, 'any')
    } catch (err: any) {
      setError(err.message)
    }
  })
  const [tokenSymbol, setTokenSymbol] = useState('USDC')
  const [fromChain, setFromChain] = useState('optimism')
  const [toChain, setToChain] = useState('arbitrum')
  const [estimate, setEstimate] = useState<any>(null)
  const [needsApproval, setNeedsApproval] = useState(false)
  const [tokenBalance, setTokenBalance] = useState<any>(null)
  const bridge = useMemo(() => {
    const hop = new Hop('mainnet', signer)
    const bridge = hop.bridge(tokenSymbol)
    return bridge
  }, [tokenSymbol, signer])

  const updateBalance = async () => {
    try {
      if (!provider) {
        return
      }
      if (!address) {
        return
      }
      const _balance = await provider.getBalance(address)
      setNativeTokenBalance(_balance)
    } catch (err: any) {
      console.error(err.message)
    }
  }

  const updateBalanceCb = useCallback(updateBalance, [updateBalance])

  useEffect(() => {
    if (address) {
      updateBalanceCb()
    }
  }, [address, updateBalanceCb])

  useInterval(updateBalance, 5 * 1000)

  const updateTokenBalance = async () => {
    try {
      if (!address) {
        return
      }
      const _balance = await bridge.getTokenBalance(fromChain)
      setTokenBalance(_balance)
    } catch (err: any) {
      console.error(err.message)
    }
  }

  const updateTokenBalanceCb = useCallback(updateTokenBalance, [updateTokenBalance])

  useEffect(() => {
    if (address) {
      updateTokenBalanceCb()
    }
  }, [address, updateTokenBalanceCb])

  useInterval(updateTokenBalance, 5 * 1000)

  useEffect(() => {
    async function update () {
      if (signer) {
        const address = await signer?.getAddress()
        setAddress(address)
      } else {
        setAddress('')
      }
    }

    update().catch(console.error)
  }, [signer])

  async function updateNeedsApproval () {
    if (signer) {
      try {
        const amountBn = bridge.parseUnits(amount)
        const _needsApproval = await bridge.needsApproval(amountBn, fromChain)
        setNeedsApproval(_needsApproval)
      } catch (err: any) {
        setError(err.message)
      }
    }
  }

  const updateNeedsApprovalCb = useCallback(updateNeedsApproval, [updateNeedsApproval])

  useEffect(() => {
    updateNeedsApprovalCb().catch(console.error)
  }, [updateNeedsApprovalCb])

  useInterval(updateNeedsApproval, 5 * 1000)

  async function handleConnect (event: any) {
    event.preventDefault()
    try {
      if (provider) {
        await provider.send('eth_requestAccounts', [])
        if (provider.getSigner()) {
          setSigner(provider.getSigner())
        }
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleDisconnect (event: any) {
    event.preventDefault()
    setSigner(null)
  }

  useEffect(() => {
    async function update () {
      try {
        setSuccess('')
        setError('')
        setEstimate(null)
        const amountBn = bridge.parseUnits(amount)
        const _estimate = await bridge.getSendData(amountBn, fromChain, toChain)
        setEstimate(_estimate)
      } catch (err: any) {
        setError(err.message)
      }
    }
    update().catch(console.error)
  }, [bridge, fromChain, toChain, amount])

  async function handleApprove (event: any) {
    event.preventDefault()
    try {
      setSuccess('')
      setError('')
      const amountBn = bridge.parseUnits(amount)
      const tx = await bridge.sendApproval(amountBn, fromChain, toChain)
      if (tx.hash) {
        setSuccess(`Sent approval: ${tx.hash}`)
      }
    } catch (err: any) {
      setSuccess('')
      setError(err.message)
    }
  }

  async function handleSend (event: any) {
    event.preventDefault()
    try {
      setSuccess('')
      setError('')
      const amountBn = bridge.parseUnits(amount)
      let options :any = {}
      if (fromChain === 'ethereum') {
        options = {
          relayerFee: 0
        }
      } else {
        options = {
          bonderFee: estimate.totalFee
        }
      }
      const tx = await bridge.send(amountBn, fromChain, toChain, options)
      if (tx.hash) {
        setSuccess(`Sent ${tx.hash}`)
      }
    } catch (err: any) {
      setSuccess('')
      setError(err.message)
    }
  }

  const isConnected = !!signer
  const nativeTokenBalanceFormatted = address && nativeTokenBalance ? Number(formatEther(nativeTokenBalance)).toFixed(4) : '-'
  const tokenBalanceFormatted = address && tokenBalance ? bridge.formatUnits(tokenBalance).toFixed(4) : '-'
  const totalFeeFormatted = estimate && amount ? `${bridge.formatUnits(estimate.totalFee).toFixed(4)} ${tokenSymbol}` : '-'
  const estimatedReceivedFormatted = estimate && amount ? `${bridge.formatUnits(estimate.estimatedReceived).toFixed(4)} ${tokenSymbol}` : '-'
  const sendEnabled = isConnected && estimate && amount && !needsApproval
  const codeSnippet = useMemo(() => {
    let amountString = ''
    try {
      amountString = bridge.parseUnits(amount).toString()
    } catch (err: any) { }
    return `
import { Hop } from '@hop-protocol/sdk'
import { providers } from 'ethers'

function main() {
  const provider = new providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const hop = new Hop('mainnet', signer)
  const bridge = hop.bridge('${tokenSymbol}')
  const { totalFee, estimatedReceived } = await bridge.getSendData('${amountString}', '${fromChain}', '${toChain}')
  const needsApproval = await bridge.needsApproval('${amountString}', '${fromChain}')
  if (needsApproval) {
    const tx = await bridge.sendApproval('${amountString}', '${fromChain}', '${toChain}')
    await tx.wait()
  }
  const tx = await bridge.send('${amountString}', '${fromChain}', '${toChain}', { bonderFee: totalFee })
  console.log(tx.hash)
}

main().catch(console.error)
  `.trim()
  }, [bridge, tokenSymbol, fromChain, toChain, amount])

  return (
    <Box>
      <Box p={4} m="0 auto" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Box mb={4}>
          <Typography variant="h4">
            Hop SDK Demo
          </Typography>
        </Box>
        {!isConnected && (
          <Box mb={2}>
            <Button onClick={handleConnect} variant="contained">Connect Wallet</Button>
          </Box>
        )}
        {isConnected && (
          <Box mb={2}>
            <Button onClick={handleDisconnect} variant="contained">Disconnect</Button>
          </Box>
        )}
        {isConnected && (
          <Box mb={1}>
            Account: {address}
          </Box>
        )}
        {isConnected && (
          <Box mb={4}>
            <Box mb={1}>ETH: {nativeTokenBalanceFormatted}</Box>
            <Box mb={1}>{tokenSymbol}: {tokenBalanceFormatted}</Box>
          </Box>
        )}
        {isConnected && (
          <Box display="flex" justifyContent="space-between">
            <Box width="400px" p={4}>
              <Box mb={2}>
                <Typography variant="body1">
                  Send {tokenSymbol}
                </Typography>
              </Box>
              <Box mb={2}>
                <TokenDropdown label="Token" value={tokenSymbol} handleChange={(event: any) => {
                  setTokenSymbol(event.target.value)
                }} />
              </Box>
              <Box mb={2}>
                <ChainDropdown label="From Chain" value={fromChain} handleChange={(event: any) => {
                  setFromChain(event.target.value)
                }} />
              </Box>
              <Box mb={2}>
                <ChainDropdown label="To Chain" value={toChain} handleChange={(event: any) => {
                  setToChain(event.target.value)
                }} />
              </Box>
              <Box mb={4}>
                <TextField label="Amount" value={amount} onChange={(event: any) => {
                  setAmount(event.target.value)
                }} />
              </Box>
              <Box mb={4}>
                <Box mb={1}>
                  Send {amount} {tokenSymbol} {fromChain} {'→'} {toChain}
                </Box>
                <Box mb={1}>
                  Total Fee: {totalFeeFormatted}
                </Box>
                <Box mb={1}>
                  Estimated Received: <strong>{estimatedReceivedFormatted}</strong>
                </Box>
              </Box>
              <Box mb={4}>
                <LoadingButton disabled={!needsApproval} onClick={handleApprove} variant="contained">Approve</LoadingButton>
              </Box>
              <Box mb={4}>
                <LoadingButton disabled={!sendEnabled} onClick={handleSend} variant="contained">Send</LoadingButton>
              </Box>
              {!!error && (
                <Box mb={4} style={{ maxWidth: '400px', wordBreak: 'break-word' }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              )}
              {!!success && (
                <Box mb={4}>
                  <Alert severity="success">{success}</Alert>
                </Box>
              )}
            </Box>
            <Box p={4}>
              <SyntaxHighlighter
                language="javascript"
                style={theme}
                showLineNumbers={true}
                wrapLongLines={true}
              >
                {codeSnippet}
              </SyntaxHighlighter>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default App
