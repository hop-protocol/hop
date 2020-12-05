import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'

import ProposalPreviewCard from 'src/pages/Governance/ProposalPreviewCard'

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '4.2rem'
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
}))

interface IProposal {
  index: string
  description: string
  status: string
}

const Governance: FC = () => {
  const styles = useStyles()

  const proposals: IProposal[] = [
    {
      index: '2',
      description: 'Retroactive Proxy Contract Airdrop',
      status: 'passed'
    }, {
      index: '1',
      description: 'Reduce HOP Governance Proposal',
      status: 'defeated'
    }
  ]

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" className={styles.title}>
          Proposals
        </Typography>
      </Box>
      {
        proposals.map((proposal: IProposal)=>
          <ProposalPreviewCard
            index={proposal.index}
            description={proposal.description}
            status={proposal.status}
          />
      )}
    </Box>
  )
}

export default Governance
