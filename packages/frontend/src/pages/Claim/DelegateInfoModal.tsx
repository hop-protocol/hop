import Box from '@material-ui/core/Box'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import Typography from '@material-ui/core/Typography'
import remarkGfm from 'remark-gfm'
import { Button } from 'src/components/Button'
import { Link } from 'src/components/Link'
import { Modal } from 'src/components/Modal'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: any) => ({
  root: {
    '& a': {
      textDecoration: 'none',
      color: theme.palette.primary.main
    }
  }
}))

interface Props {
  onClose: () => void
  delegate: any
}

export const DelegateInfoModal = (props: Props) => {
  const { onClose, delegate } = props
  const styles = useStyles()

  function handleClose() {
    onClose()
  }

  return (
    <Modal onClose={handleClose}>
      <Box display="flex" flexDirection="column" textAlign="left">
        <Box mb={2} display="flex" flexDirection="column">
          <Box mb={4} display="flex" flexDirection="column">
            <Typography variant="body1" color="textPrimary">
              Delegate&nbsp;
              <Link
                target="_blank" rel="noopener noreferrer"
                href={delegate.infoUrl}
              >submission</Link>&nbsp;for <strong>{delegate.ensName}</strong>
            </Typography>
          </Box>
          <Box style={{ maxHeight: '100%', overflow: 'auto', wordBreak: 'break-word' }} className={styles.root}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{delegate.info?.trim()}</ReactMarkdown>
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

