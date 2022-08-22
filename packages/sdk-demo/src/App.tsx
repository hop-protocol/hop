import React, { useState, useEffect, useCallback } from 'react'
import { useInterval } from 'react-use'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { providers } from 'ethers'
import { formatEther, parseUnits, formatUnits } from 'ethers/lib/utils'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Hop } from '@hop-protocol/sdk'
import './App.css'

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
  const [balance, setBalance] = useState('-')
  const [amount, setAmount] = useState('')
  const [signer, setSigner] = useState<any>(null)
  const [provider] = useState(() => {
    try {
      return new providers.Web3Provider((window as any).ethereum)
    } catch (err: any) {
      setError(err.message)
    }
  })
  const [fromChain, setFromChain] = useState('ethereum')
  const [toChain, setToChain] = useState('arbitrum')
  const [estimate, setEstimate] = useState<any>(null)

  const updateBalance = async () => {
    try {
      if (!provider) {
        return
      }
      if (!address) {
        return
      }
      const _balance = await provider.getBalance(address)
      setBalance(formatEther(_balance.toString()))
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

  async function handleEstimate (event: any) {
    event.preventDefault()
    try {
      setSuccess('')
      setError('')
      const hop = new Hop('mainnet')
      const bridge = hop.bridge('USDC')
      const decimals = 6
      const amountBn = parseUnits(amount, decimals)
      const data = await bridge.getSendData(amountBn, fromChain, toChain)
      setEstimate(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleSend (event: any) {
    event.preventDefault()
    try {
      setSuccess('')
      setError('')
      const hop = new Hop('mainnet')
      const bridge = hop.connect(signer).bridge('USDC')
      const decimals = 6
      const amountBn = parseUnits(amount, decimals)
      const tx = await bridge.send(amountBn, fromChain, toChain, {
        bonderFee: estimate.totalFee
      })
      if (tx.hash) {
        setSuccess(`Sent ${tx.hash}`)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const isConnected = !!signer

  return (
    <Box>
      <Box width="400px" p={4} m="0 auto" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Box mb={4}>
          <Typography variant="h4">
            Hop SDK Demo
          </Typography>
        </Box>
        {!isConnected && (
          <Button onClick={handleConnect} variant="contained">Connect Wallet</Button>
        )}
        {isConnected && (
          <Box mb={2}>
            <Button onClick={handleDisconnect} variant="contained">Disconnect</Button>
          </Box>
        )}
        {isConnected && (
          <Box mb={1}>
            {address}
          </Box>
        )}
        {isConnected && (
          <Box mb={4}>ETH: {balance}</Box>
        )}
        {isConnected && (
          <Box>
            <Box mb={2}>
              <Typography variant="body1">
                Send USDC
              </Typography>
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
              <Button onClick={handleEstimate} variant="contained">Get Estimate Cost</Button>
            </Box>
            {!!estimate && (
              <Box><pre>{JSON.stringify(estimate, null, 2)}</pre></Box>
            )}
            {!!estimate && (
              <>
                <Box mb={1}>
                  {amount} {'USDC'} {fromChain} {'->'} {toChain}
                </Box>
                <Box mb={1}>
                  Total Fee: {formatUnits(estimate.totalFee, 6)} {'USDC'}
                </Box>
                <Box mb={1}>
                  Estimated Received: {formatUnits(estimate.estimatedReceived, 6)} {'USDC'}
                </Box>
                <Box mb={4}>
                  <Button onClick={handleSend} variant="contained">Send Tx</Button>
                </Box>
              </>
            )}
          </Box>
        )}
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
    </Box>
  )
}

export default App
