import React, { FC, useEffect, useState } from 'react'
import { Link } from 'src/components/Link'
import Button from 'src/components/buttons/Button'
import Typography from '@material-ui/core/Typography'
import Modal from 'src/components/modal'
import Box from '@material-ui/core/Box'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  onClose: () => void
  delegate: any
}

export const DelegateInfoModal = (props: Props) => {
  const { onClose, delegate } = props

  function handleClose() {
    onClose()
  }

  return (
    <Modal onClose={handleClose}>
      <Box display="flex" flexDirection="column" textAlign="left">
        <Box mb={2} display="flex" flexDirection="column">
          <Box mb={4} display="flex" flexDirection="column">
            <Typography variant="body1" color="textPrimary">
              Delegate
              <Link
                href={delegate.infoUrl}
              > submission </Link>
                for <strong>{delegate.ensName}</strong>
            </Typography>
          </Box>
          <Box style={{ maxHeight: '700px', overflow: 'auto' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{delegate.info}</ReactMarkdown>
          </Box>
        </Box>
        <Box mt={3} display="flex">
          <Button
            onClick={() => {
              handleClose()
            }}
            large
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

