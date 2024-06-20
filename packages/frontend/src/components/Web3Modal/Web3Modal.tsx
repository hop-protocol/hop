import Box from '@mui/material/Box'
import React from 'react'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { Button } from '#components/Button/index.js'
import { Modal } from '#components/Modal/Modal.js'
import { useWeb3ModalStyles } from './useWeb3ModalStyles.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { Alert } from '#components/Alert/index.js'

export function Web3Modal () {
  const styles = useWeb3ModalStyles()
  const { walletOptions, web3ModalActive, setWeb3ModalActive, setWeb3ModalChoice, web3ModalChoice, walletChoiceLoading, error } = useWeb3Context()

  if (!web3ModalActive) {
    return null
  }

  function handleClose () {
    setWeb3ModalActive(false)
  }

  function handleSelect (wallet: string) {
    setWeb3ModalChoice(wallet)
  }

  return (
    <Modal onClose={handleClose}>
      <Box display="flex" alignItems="center" flexDirection="column">
        <Box mb={4}>
          <Typography variant="h5">Connect Wallet</Typography>
        </Box>
        {walletOptions.map((option) => {
          return (
            <Box key={option.id} mb={2} width="100%" maxWidth={'32rem'}>
              <Button className={styles.button} onClick={() => handleSelect(option.id)}>
                <Box display="flex" alignItems="center" justifyContent="flex-start">
                  <Box mr={1} width="32px" height="32px" display="flex" alignItems="center">
                    <img
                      src={option.icon}
                      alt="Icon"
                      width="100%"
                      height="auto"
                    />
                  </Box>
                  <Typography variant="subtitle1" component="div">{option.name}</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end" width="22px" marginRight="-16px">
                  {(walletChoiceLoading && option.id === web3ModalChoice) && <CircularProgress size={16} />}
                </Box>
              </Button>
            </Box>
          )
        })}
      </Box>
      <Box display="flex" alignItems="center" flexDirection="column">
        {error && (
          <Alert severity={'error'}>{error}</Alert>
        )}
      </Box>
    </Modal>
  )
}
