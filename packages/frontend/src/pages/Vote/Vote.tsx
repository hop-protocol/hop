import React, { FC, useState, useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { formatUnits } from 'ethers/lib/utils'
import useInterval from 'src/hooks/useInterval'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import { IProposal } from 'src/config'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import ProposalPreviewCard from 'src/pages/Vote/ProposalPreviewCard'
import DelegateModal from 'src/pages/Vote/DelegateModal/DelegateModal'
import { ZERO_ADDRESS } from 'src/config/constants'

const useStyles = makeStyles(() => ({
  headerWrapper: {
    display: 'flex',
    width: '51rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '4.2rem'
  },
  buttonStyle: {
    margin: 'initial'
  },
  pricesBox: {
    width: '51.6rem',
    marginTop: '4.2rem',
    marginBottom: '4.2rem'
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  pricesCard: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  delegateOverview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}))

type VoteProps = {
  proposals: IProposal[]
}

const Vote: FC<VoteProps> = props => {
  const { proposals } = props
  const styles = useStyles()
  const { address } = useWeb3Context()
  const { user, tokens, contracts, networks } = useApp()
  const l1Hop = contracts?.l1Hop
  const l1HopToken = tokens[1]

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [balance, setBalance] = useState('0.00')
  const [delegate, setDelegate] = useState(ZERO_ADDRESS)
  const [humanReadableDelegate, setHumanReadableDelegate] = useState('')

  const getBalance = useCallback(() => {
    const _getBalance = async () => {
      if (user && l1HopToken) {
        const _balance = await user.getBalance(l1HopToken, networks[0])
        setBalance(Number(formatUnits(_balance, 18)).toFixed(2))
      }
    }

    _getBalance()
  }, [user, l1HopToken, networks[0]])

  const getDelegate = useCallback(() => {
    const _getDelegate = async () => {
      if (user && l1HopToken) {
        const _delegate = await l1Hop?.delegates(address?.toString())
        setDelegate(_delegate)
      }
    }

    _getDelegate()
  }, [user, l1HopToken, networks[0]])

  useEffect(() => {
    getBalance()
  }, [getBalance, user, l1HopToken, networks[0]])

  useEffect(() => {
    getDelegate()
  }, [getDelegate, user, l1HopToken, networks[0]])

  useInterval(() => {
    getBalance()
    getDelegate()
  }, 20e3)

  useEffect(() => {
    if (delegate === address?.toString()) {
      setHumanReadableDelegate('self')
    } else {
      const _humanReadableDelegateStart = delegate.substr(0,6)
      const _humanReadableDelegateEnd = delegate.substr(38,4)
      setHumanReadableDelegate(_humanReadableDelegateStart + '...' + _humanReadableDelegateEnd)
    }
  }, [delegate])


  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <DelegateModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        numVotes={balance}
        l1Hop={l1Hop}
      />
      <Box display="flex" alignItems="center" className={styles.headerWrapper}>
        <Typography variant="h6">Participating Pools</Typography>
        {balance !== '0.00' &&
          delegate === ZERO_ADDRESS ? (
            <Button
              className={styles.buttonStyle}
              onClick={() => setModalIsOpen(true)}
            >
              Unlock Voting
            </Button>
          )
          :
          (
            <Box className={styles.delegateOverview}>
              <Typography variant="body1">
                { balance } Votes
              </Typography>
              <Typography variant="body1">
                Delegated to { humanReadableDelegate }
              </Typography>
            <Button
              onClick={() => setModalIsOpen(true)}
            >
              Edit Delegate
            </Button>
            </Box>
          )
        }
      </Box>
      {proposals.map((proposal: IProposal) => (
        <ProposalPreviewCard
          key={proposal.id}
          id={proposal.id}
          description={proposal.title}
          status={proposal.status}
        />
      ))}
    </Box>
  )
}

export default Vote
