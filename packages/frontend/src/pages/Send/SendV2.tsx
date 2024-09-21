import React, { useState } from 'react'
import Box from '@mui/material/Box'
import MuiButton from '@mui/material/Button'
import { Button } from '#components/Button/index.js'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { TokenListModal } from './TokenListModal'
import IconButton from '@mui/material/IconButton'
import ArrowDownward from '@mui/icons-material/ArrowDownward'

interface Token {
  name: string
  symbol: string
  decimals: number
  balance: number
  logoURI: string
  chainId: number
  address: string
}

const mockTokenA: Token = {
  name: 'Mock Token A',
  symbol: 'MOCKA',
  decimals: 18,
  balance: 1000,
  logoURI: 'https://assets.hop.exchange/logos/mocka.svg',
  chainId: 1,
  address: '0x0000000000000000000000000000000000000001',
}

const mockTokenB: Token = {
  name: 'Mock Token B',
  symbol: 'MOCKB',
  decimals: 18,
  balance: 500,
  logoURI: 'https://assets.hop.exchange/logos/mockb.svg',
  chainId: 1,
  address: '0x0000000000000000000000000000000000000002',
}

const useSend = () => {
  const [tokenA, setTokenA] = useState<Token | null>(mockTokenA)
  const [tokenB, setTokenB] = useState<Token | null>(mockTokenB)
  const [amountA, setAmountA] = useState<string>('')
  const [amountB, setAmountB] = useState<string>('')

  const handleSend = () => {
    console.log(`${amountA} ${tokenA?.symbol}, ${amountB} ${tokenB?.symbol}`)
  }

  return {
    tokenA,
    tokenB,
    amountA,
    amountB,
    setTokenA,
    setTokenB,
    setAmountA,
    setAmountB,
    handleSend,
  }
}

export const SendV2: React.FC = () => {
  const {
    tokenA,
    tokenB,
    amountA,
    amountB,
    setTokenA,
    setTokenB,
    setAmountA,
    setAmountB,
    handleSend,
  } = useSend()

  const [isTokenAModalOpen, setIsTokenAModalOpen] = useState(false)
  const [isTokenBModalOpen, setIsTokenBModalOpen] = useState(false)

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ maxWidth: '450px', margin: '0 auto', padding: '2rem' }}>
      <Typography variant="h5" gutterBottom>
        Send
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Box sx={{
            marginBottom: '1rem',
            backgroundColor: '#f0f0f0',
            padding: '2rem',
            borderRadius: '16px',
        }}>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" flexDirection="column">
              <Box>
                <Typography variant="body1" sx={{ color: '#7d7d7d', fontWeight: 'bold' }}>Origin</Typography>
              </Box>
              <TextField
                fullWidth
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
                placeholder="0.0"
                sx={{
                  marginTop: '0.5rem',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none', // Remove the border
                    },
                    '&:hover fieldset': {
                      border: 'none', // Remove the border on hover
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none', // Remove the border when focused
                    },
                  }
                }}
                InputProps={{
                  sx: {
                    fontSize: '3.2rem',
                    color: '#000',
                  }
                }}
              />
              <Box>
                <Typography variant="body1" sx={{ color: '#7d7d7d', fontWeight: 'bold' }}>$0.00</Typography>
              </Box>
            </Box>
            <Box display="flex" justifyContent="center" flexDirection="column">
              <Box display="flex" alignItems="center" sx={{ height: '100%' }}>
                <TokenListModal
                  onTokenSelect={(token: Token) => {
                    setTokenA(token)
                  }}
                  selectedChainId=""
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                <Typography sx={{ color: '#7d7d7d', fontWeight: 'bold' }}>Balance: 0.0</Typography> <MuiButton variant="text" onClick={() => {}} sx={{ width: '30px', minWidth: '0', height: '10px', padding: '1rem 2rem', fontSize: '1.4rem' }}>Max</MuiButton>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <IconButton
            aria-label="Switch direction"
            color="primary"
            size="large"
            sx={{
              background: '#f0f0f0',
              borderRadius: '10px',
              border: '2px solid white',
              color: '#000'
            }}
          >
            <ArrowDownward />
          </IconButton>
        </Box>

        <Box sx={{
          marginBottom: '1rem',
          backgroundColor: '#f0f0f0',
          padding: '2rem',
          borderRadius: '16px',
        }}
        >
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" flexDirection="column">
              <Box>
                <Box>
                  <Typography variant="body1" sx={{ color: '#7d7d7d', fontWeight: 'bold' }}>Destination</Typography>
                </Box>
                <TextField
                  fullWidth
                  value={amountB}
                  placeholder="0.0"
                  sx={{
                    marginTop: '0.5rem',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        border: 'none', // Remove the border
                      },
                      '&:hover fieldset': {
                        border: 'none', // Remove the border on hover
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none', // Remove the border when focused
                      },
                    }
                  }}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      fontSize: '3.2rem',
                      color: '#000',
                    }
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ color: '#7d7d7d', fontWeight: 'bold' }}>$0.00</Typography>
              </Box>
            </Box>
              <Box display="flex" justifyContent="center" flexDirection="column">
                <Box display="flex" alignItems="center" sx={{ height: '100%' }}>
                  <TokenListModal
                    onTokenSelect={(token: Token) => {
                      setTokenB(token)
                    }}
                    selectedChainId=""
                  />
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                  {tokenB && (
                    <Typography sx={{ color: '#7d7d7d', fontWeight: 'bold' }}>Balance: 0.0</Typography>
                  )}
                </Box>
              </Box>
            </Box>
        </Box>
      </Box>

      <Button disabled={true} highlighted fullWidth large onClick={handleSend}>
        Send
      </Button>
    </Box>
  )
}
