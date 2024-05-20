import Box from '@mui/material/Box'
import React from 'react'
import Typography from '@mui/material/Typography'
import { Button } from '#components/Button/index.js'
import { Modal } from '#components/Modal/Modal.js'
import { useWeb3ModalStyles } from './useWeb3ModalStyles.js'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { Alert } from '#components/Alert/index.js'

export function Web3Modal () {
  const styles = useWeb3ModalStyles()
  const { walletOptions, web3ModalActive, setWeb3ModalActive, setWeb3ModalChoice, error } = useWeb3Context()

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
            <Box mb={2} width="100%" maxWidth={'32rem'}>
              <Button className={styles.button} onClick={() => handleSelect(option.id)}>
                <Box width="32px" height="32px" display="flex" alignItems="center">
                  <img
                    src={option.icon}
                    alt="Icon"
                    width="100%"
                    height="auto"
                  />
                </Box>
                <Typography variant="subtitle1" component="div">{option.name}</Typography>
              </Button>
            </Box>
          )
        })}
      </Box>
      {error && (
        <Box display="flex" alignItems="center" flexDirection="column">
          <Alert severity={'error'}>{error}</Alert>
        </Box>
      )}
    </Modal>
  )
}
