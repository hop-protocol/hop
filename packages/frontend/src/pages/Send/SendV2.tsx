import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import MuiButton from '@mui/material/Button'
import { Button } from '#components/Button/index.js'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { TokenListModal } from './TokenListModal'
import IconButton from '@mui/material/IconButton'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import { useV2Send } from '#hooks/useV2Send.js'
import { Alert } from '#components/Alert/index.js'
import Skeleton from '@mui/material/Skeleton'
import { ConnectWalletButton } from '#components/Header/ConnectWalletButton.js'
import { MultiHopStepper } from './MultiHopStepper.js'

interface Token {
  name: string
  symbol: string
  decimals: number
  balance: number
  logoURI: string
  chainId: number
  address: string
}

export const SendV2: React.FC = () => {
  const {
    setFromChainId,
    setToChainId,
    setTokenSymbol,
    fromChainId,
    toChainId,
    amountIn,
    estimatedReceivedDisplay,
    sendTokens,
    sendReady,
    tokenSymbol,
    setAmountIn,
    fromTokenBalanceFormatted,
    toTokenBalanceFormatted,
    handleSwitchDirection,
    needsApproval,
    approveTokens,
    isSending,
    isApproving,
    sendTx,
    setSendTx,
    isFetchingGetSendData,
    handleMaxClick,
    error,
    setError,
    fromBalanceUsdDisplay,
    toBalanceUsdDisplay,
    isLoadingFromTokenBalance,
    isLoadingToTokenBalance,
    isLoadingNeedsApproval,
    bonderFee,
    bonderFeeDisplay,
    bonderFeeUsdDisplay,
    totalFeeDisplay,
    accountAddress,
    fromTokenBalanceDisplay,
    toTokenBalanceDisplay,
    hasEnoughBalance,
    routeChainIds
  } = useV2Send()

  const [selectedFromToken, setSelectedFromToken] = useState<Token | null>(null)
  const [selectedToToken, setSelectedToToken] = useState<Token | null>(null)

  // Effect to clear "to" token if "from" token changes and the symbols do not match
  useEffect(() => {
    if (selectedToToken && selectedFromToken?.symbol !== selectedToToken.symbol) {
      setSelectedToToken(null)
      setToChainId('')
    }
  }, [selectedFromToken])

  function switchDirection() {
    handleSwitchDirection()
    setSelectedFromToken(selectedToToken)
    setSelectedToToken(selectedFromToken)
  }

  let buttonDisabled = !sendReady
  let buttonAction = sendTokens
  let buttonText = isSending ? 'Sending' : 'Send'
  let buttonLoading = isSending

  if (!hasEnoughBalance) {
    buttonText = 'Insufficient balance'
  }

  if (!fromChainId) {
    buttonText = 'Select a token'
  }

  if (!toChainId) {
    buttonText = 'Select destination'
  }

  if (!amountIn) {
    buttonText = 'Enter amount'
  }

  if (needsApproval) {
    buttonDisabled = !needsApproval
    buttonAction = approveTokens
    buttonText = isApproving ? 'Approving' : 'Approve'
    buttonLoading = isApproving
  }

  if (isLoadingNeedsApproval) {
    buttonDisabled = true
    buttonLoading = false
    buttonText = 'Checking approval'
  }

  if (isFetchingGetSendData) {
    buttonDisabled = true
    buttonLoading = false
    buttonText = 'Getting estimate'
  }

  const showMaxButton = (fromTokenBalanceFormatted !== '' && tokenSymbol !== 'ETH')

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
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
                <Typography variant="body1" sx={{ color: '#7d7d7d', fontWeight: 'bold' }}>Amount</Typography>
              </Box>
              <TextField
                fullWidth
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                placeholder="0"
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
                    color: '#000'
                  }
                }}
              />
              <Box>
                <Typography variant="body1" sx={{ color: '#7d7d7d', fontWeight: 'bold' }}>
                  {fromBalanceUsdDisplay || <>&nbsp;</>}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" justifyContent="center" flexDirection="column">
              <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ height: '100%' }}>
                <TokenListModal
                  value={selectedFromToken}
                  onTokenSelect={(token: Token) => {
                    console.log('fromToken', token)
                    setSelectedFromToken(token)
                    setFromChainId(token.chainId.toString())
                    setTokenSymbol(token.symbol)

                    if (tokenSymbol !== token.symbol) {
                      setToChainId('')
                    }
                  }}
                  clear={!selectedFromToken}
                />
              </Box>
              {(!!accountAddress && fromChainId && Number(fromTokenBalanceFormatted) > 0) && (
                <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                  <Typography sx={{
                    display: 'flex',
                    color: '#7d7d7d',
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>Balance: {isLoadingFromTokenBalance ? (
                    <Skeleton animation="wave" width={'20px'} title="loading" />
                  ) : fromTokenBalanceDisplay}</Typography>
                  {showMaxButton && (
                    <MuiButton variant="text" onClick={() => handleMaxClick()} sx={{ width: '30px', minWidth: '0', height: '10px', padding: '1rem 2rem', fontSize: '1.4rem' }}>Max</MuiButton>
                  )}
                </Box>
              )}
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
            onClick={switchDirection}
            sx={{
              background: '#f0f0f0',
              borderRadius: '10px',
              border: '2px solid white',
              color: '#000',
              '&:hover': {
                background: '#f0f0f0'
              }
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
                  value={estimatedReceivedDisplay === '0' ? '': estimatedReceivedDisplay}
                  placeholder="0"
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
                      animation: isFetchingGetSendData
                        ? `loadingEffect 1s cubic-bezier(0.4, 0, 0.6, 1) infinite !important`
                        : 'none'
                    }
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ color: '#7d7d7d', fontWeight: 'bold' }}>{toBalanceUsdDisplay || <>&nbsp;</>}</Typography>
              </Box>
            </Box>
              <Box display="flex" justifyContent="center" flexDirection="column">
                <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ height: '100%' }}>
                  <TokenListModal
                    value={selectedToToken}
                    onTokenSelect={(token: Token) => {
                      console.log('toToken', token)
                      setSelectedToToken(token)
                      setToChainId(token.chainId.toString())
                      setTokenSymbol(token.symbol)

                      if (tokenSymbol !== token.symbol) {
                        setFromChainId('')
                      }
                    }}
                    selectedTokenSymbol={tokenSymbol}
                    excludeChainId={fromChainId}
                    clear={!selectedToToken}
                  />
                </Box>
                {(!!accountAddress && toChainId && Number(toTokenBalanceFormatted) > 0) && (
                  <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                      <Typography sx={{
                        display: 'flex',
                        color: '#7d7d7d',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>Balance: {isLoadingToTokenBalance ? (
                    <Skeleton animation="wave" width={'20px'} title="loading" />
                      ) : toTokenBalanceDisplay}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
        </Box>
      </Box>

      {!accountAddress && (
        <ConnectWalletButton large fullWidth />
      )}
      {!!accountAddress && (
        <Button disabled={buttonDisabled} highlighted fullWidth large onClick={buttonAction} loading={buttonLoading}>
          {buttonText}
        </Button>
      )}

      {bonderFee?.gt(0) && (
        <Box mt={2} pl={2} width="100%" display="flex" alignItems="flex-start">
          <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold" }}>
            <Box display="inline-flex" sx={{ color: '#4d4d4d' }}>Fee: {bonderFeeDisplay}</Box> <Box display="inline-flex" sx={{ color: '#7d7d7d' }}>({bonderFeeUsdDisplay})</Box>
          </Typography>
        </Box>
      )}

      {routeChainIds?.length > 0 && (
        <MultiHopStepper steps={routeChainIds} />
      )}

      {!!error && (
        <Box mt={6}>
          <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
        </Box>
      )}

      {!!sendTx && (
        <Box mt={6}>
          <Alert severity="success" onClose={() => setSendTx(null)}>Transaction Hash: {sendTx.hash}</Alert>
        </Box>
      )}
    </Box>
  )
}
