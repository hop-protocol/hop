import React, { FC, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from 'src/components/modal/Modal'
import Button from 'src/components/buttons/Button'
import Box from '@material-ui/core/Box'
import LargeTextField from 'src/components/LargeTextField'
import Typography from '@material-ui/core/Typography'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Address from 'src/models/Address'
import DelegateModalTransaction from 'src/pages/Vote/DelegateModal/DelegateModalTransaction'
import { Contract } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import Transaction from 'src/models/Transaction'
import { L1_NETWORK } from 'src/utils/constants'

const useStyles = makeStyles(() => ({
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  textContainer: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  actionContainer: {
    display: 'flex',
    alignSelf: 'center',
    margin: '1rem',
  },
  selfDelegateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textFieldContainer: {
    alignSelf: 'center',
  },
}))

type DelegateModalProps = {
  isOpen: boolean
  onClose: () => void
  numVotes: string
  l1Hop: Contract | undefined
}

const DelegateModal: FC<DelegateModalProps> = props => {
  const { isOpen, onClose, numVotes, l1Hop } = props
  const app = useApp()
  const styles = useStyles()
  const { address: userAddress } = useWeb3Context()

  const [isOtherDelegate, setIsOtherDelegate] = useState(false)
  const [isTransactionPending, setIsTransactionPending] = useState(false)
  const [delegateAddress, setDelegateAddress] = useState<Address | undefined>()

  function handleOnClose() {
    setDelegateAddress(undefined)
    setIsOtherDelegate(false)
    setIsTransactionPending(false)
    onClose()
  }

  const handleAddressInput = async (event: any) => {
    try {
      const value = event.target.value || ''
      const _address = new Address(value)
      setDelegateAddress(_address)
    } catch (err) {}
  }

  const handleDelegateClick = async () => {
    setIsTransactionPending(true)
    const _delegateAddress = delegateAddress || userAddress
    const tx = await l1Hop?.delegate(_delegateAddress?.toString())
    setIsTransactionPending(false)

    app?.txHistory?.addTransaction(
      new Transaction({
        hash: tx?.hash,
        networkName: L1_NETWORK,
      })
    )

    handleOnClose()
  }

  return (
    <>
      {isOpen && (
        <Modal onClose={handleOnClose}>
          {!isTransactionPending && (
            <Box display="flex" alignItems="center" className={styles.modalContainer}>
              <Typography variant="h6">Participating Pools</Typography>
              <Typography variant="body1" className={styles.textContainer}>
                Earned HOP tokens represent voting shares in Hop governance.
              </Typography>
              <Typography variant="body1" className={styles.textContainer}>
                You can either vote on each proposal yourself or delegate your votes to a third
                party.
              </Typography>
              {isOtherDelegate && (
                <LargeTextField
                  onChange={handleAddressInput}
                  centerAlign
                  defaultShadow
                  autoFocus
                  placeholder="Wallet Address"
                  className={styles.textFieldContainer}
                />
              )}
              <Box display="flex" alignItems="center" className={styles.actionContainer}>
                <Button
                  highlighted
                  disabled={isOtherDelegate && !delegateAddress}
                  onClick={handleDelegateClick}
                >
                  Delegate Votes
                </Button>
                {!isOtherDelegate && (
                  <Button highlighted onClick={() => setIsOtherDelegate(true)}>
                    Add Delegate
                  </Button>
                )}
              </Box>
            </Box>
          )}
          {isTransactionPending && <DelegateModalTransaction numVotes={numVotes} />}
        </Modal>
      )}
    </>
  )
}

export default DelegateModal
