import React, { FC, useState, useEffect, useCallback } from 'react'
import useInterval from 'src/hooks/useInterval'
import { makeStyles } from '@material-ui/core/styles'
import { formatUnits } from 'ethers/lib/utils'
import Modal from 'src/components/modal/Modal'
import Button from 'src/components/buttons/Button'
import Box from '@material-ui/core/Box'
import LargeTextField from 'src/components/LargeTextField'
import Typography from '@material-ui/core/Typography'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import Address from 'src/models/Address'
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
  // const {
  //   tokenAmount
  // } = useDelegate()
  const { address } = useWeb3Context()
  const { user, tokens, networks } = useApp()
  const l1Hop = tokens[1]

  const [isSelfDelegate, setIsSelfDelegate] = useState(false)
  const [isOtherDelegate, setIsOtherDelegate] = useState(false)
  const [delegateAddress, setDelegateAddress] = useState<Address | undefined>()
  const [balance, setBalance] = useState('0.0')

  const selfOrOtherText = isOtherDelegate ? '' : 'to Self'

  // setStakedAmount(await l1Hop?.balanceOf(address?.toString()))
  // on chain
  // TODO: What do I do if a user doesn't have votes to make?
  // TODO: Read numVotes from contract
  // TODO: Add tx
  // TODO: Add state to show when  you are already delegated
  // TODO: Optimize balance getter

  function handleOnClose () {
    setIsSelfDelegate(false)
    setIsOtherDelegate(false)
    onClose()
  }

  function handleSelfDelegateClick () {
    setIsSelfDelegate(true)
    setIsOtherDelegate(false)
  }

  function handleOtherDelegateClick () {
    setIsSelfDelegate(false)
    setIsOtherDelegate(true)
  }

  const getBalance = useCallback(() => {
    const _getBalance = async () => {
      if (user && l1Hop) {
        const _balance = await user.getBalance(l1Hop, networks[0])
        setBalance(Number(formatUnits(_balance, 18)).toFixed(2))
      }
    }

    _getBalance()
  }, [user, l1Hop, networks[0]])

  useEffect(() => {
    getBalance()
  }, [getBalance, user, l1Hop, networks[0]])

  useInterval(() => {
    getBalance()
  }, 20e3)

  const handleAddressInput = async (event: any) => {
    try {
      const value = event.target.value || ''
      const address = new Address(value)
      setDelegateAddress(address)
    } catch (err) {}
  }

  return (
    <>
      {isOpen && (
        <Modal onClose={handleOnClose}>
          {!isSelfDelegate && (
            <Box
              display="flex"
              alignItems="center"
              className={styles.modalContainer}
            >
              <Typography variant="h6">Participating Pools</Typography>
              <Typography variant="body1" className={styles.textContainer}>
                Earned HOP tokens represent voting shares in Hop governance.
              </Typography>
              <Typography variant="body1" className={styles.textContainer}>
                You can either vote on each proposal yourself or delegate your
                votes to a third party.
              </Typography>
              {isOtherDelegate &&
                <LargeTextField
                  onChange={handleAddressInput}
                  centerAlign
                  defaultShadow
                  autoFocus
                  placeholder="Wallet Address"
                  className={styles.textFieldContainer}
                />
              }
              <Box display="flex" alignItems="center" className={styles.actionContainer}>
                <Button
                  highlighted
                  disabled={isOtherDelegate && !delegateAddress}
                  onClick={handleSelfDelegateClick}
                >
                  Delegate Votes {`${selfOrOtherText}`}
                </Button>
                {!isOtherDelegate && (
                  <Button highlighted onClick={handleOtherDelegateClick}>
                    Add Delegate
                  </Button>
                )}
              </Box>
            </Box>
          )}
          {
            isSelfDelegate && <DelegateModalTransaction numVotes={balance} />
          }
        </Modal>
      )}
    </>
  )
}

export default DelegateModal
