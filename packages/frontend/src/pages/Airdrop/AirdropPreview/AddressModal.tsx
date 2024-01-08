import Box from '@material-ui/core/Box'
import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { Button } from 'src/components/Button'
import { Input } from 'src/components/ui'
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
          <Input
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

