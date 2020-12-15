import React, { FC, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from 'src/components/modal/Modal'
import Button from 'src/components/buttons/Button'
import Box from '@material-ui/core/Box'
import LargeTextField from 'src/components/LargeTextField'
import Typography from '@material-ui/core/Typography'

import DelegateModalTransaction from 'src/pages/Vote/DelegateModal/DelegateModalTransaction'

const useStyles = makeStyles(() => ({
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  textContainer: {
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  actionContainer: {
    display: 'flex',
    alignSelf: 'center',
    margin: '1rem'
  },
  selfDelegateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  textFieldContainer: {
    alignSelf: 'center'
  }
}))

type DelegateModalProps = {
  isOpen: boolean
  onClose: () => void
}

const DelegateModal: FC<DelegateModalProps> = props => {
  const { isOpen, onClose } = props
  const styles = useStyles()

  const [isSelfDelegate, setIsSelfDelegate] = useState(false)
  const [isOtherDelegate, setIsOtherDelegate] = useState(false)

  const selfOrOtherText = isOtherDelegate ? '' : 'to Self'

  // TODO: What do I do if a user doesn't have votes to make?
  // TODO: Read numVotes from contract
  // TODO: Disable "Delegate" button if no valid address
  // TODO: Add tx
  // TODO: Add large text field state
  // TODO: Use address model to store state

  const numVotes = 0

  function handleOnClose() {
    setIsSelfDelegate(false)
    setIsOtherDelegate(false)
    onClose()
  }

  function handleSelfDelegateClick() {
    setIsSelfDelegate(true)
    setIsOtherDelegate(false)
  }

  function handleOtherDelegateClick() {
    setIsSelfDelegate(false)
    setIsOtherDelegate(true)
  }

  return (
    <>
      { isOpen &&
        <Modal
          onClose={handleOnClose}
        >
          { !isSelfDelegate &&
            <Box display="flex" alignItems="center" className={styles.modalContainer}>
              <Typography variant="h6">
                Participating Pools
              </Typography>
              <Typography variant="body1" className={styles.textContainer}>
                Earned HOP tokens represent voting shares in Hop governance.
              </Typography>
              <Typography variant="body1" className={styles.textContainer}>
                You can either vote on each proposal yourself or delegate your votes to a third party.
              </Typography>
              { isOtherDelegate &&
                <LargeTextField
                  centerAlign
                  placeholder="Wallet Address"
                  className={styles.textFieldContainer}
                />
              }
              <Box display="flex" alignItems="center" className={styles.actionContainer}>
                <Button
                  highlighted
                  onClick={handleSelfDelegateClick}
                >
                  Delegate Votes {`${selfOrOtherText}`}
                </Button>
                {
                  !isOtherDelegate &&
                    <Button
                      highlighted
                      onClick={handleOtherDelegateClick}
                    >
                      Add Delegate
                    </Button>
                }
              </Box>
            </Box>
          }

          {
            isSelfDelegate && <DelegateModalTransaction numVotes={numVotes} />
          }
        </Modal>
      }
    </>
  )
}

export default DelegateModal
