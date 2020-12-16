import React, { FC, useState, useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { formatUnits } from 'ethers/lib/utils'
import useInterval from 'src/hooks/useInterval'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from 'src/components/buttons/Button'
import { IProposal } from 'src/config'

import { useApp } from 'src/contexts/AppContext'
import ProposalPreviewCard from 'src/pages/Vote/ProposalPreviewCard'
import DelegateModal from 'src/pages/Vote/DelegateModal/DelegateModal'

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
  }
}))

type VoteProps = {
  proposals: IProposal[]
}

const Vote: FC<VoteProps> = props => {
  const { proposals } = props
  const styles = useStyles()
  const { user, tokens, networks } = useApp()
  const l1Hop = tokens[1]

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [balance, setBalance] = useState('0.00')

  // Mock data
  const isDelegated = false

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


  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      { console.log(balance) }
      <DelegateModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        numVotes={balance}
      />
      <Box display="flex" alignItems="center" className={styles.headerWrapper}>
        <Typography variant="h6">Participating Pools</Typography>
        {balance !== '0.00' && (
          <Button
            className={styles.buttonStyle}
            onClick={() => setModalIsOpen(true)}
          >
            Unlock Voting
          </Button>
        )}
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
