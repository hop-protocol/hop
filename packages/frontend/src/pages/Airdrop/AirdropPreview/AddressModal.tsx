import Box from '@mui/material/Box'
import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Button } from 'src/components/Button'
import { Modal } from 'src/components/Modal'

interface Props {
  onClose: () => void
  onSubmit: (address: string) => void
}

export const AddressModal = (props: Props) => {
  const { onSubmit, onClose } = props
  const [inputValue, setInputValue] = useState<string>('')

  function handleSubmit() {
    onSubmit(inputValue)
  }

  function handleClose() {
    onClose()
  }

  function handleInputChange (event: any) {
    setInputValue(event.target.value)
  }

  return (
    <Modal onClose={handleClose}>
      <Box display="flex" flexDirection="column" justifyContent="center" textAlign="center">
        <Box mb={2} display="flex" flexDirection="column">
          <Typography variant="h5" color="textPrimary">
            Check Address
          </Typography>
        </Box>
        <Box my={2}>
          <TextField
            placeholder="0x123..."
            value={inputValue}
            onChange={handleInputChange}
          />
        </Box>
        <Box mt={2}>
          <Button
            onClick={handleSubmit}
            large
            highlighted
          >
            Check Eligibility
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

