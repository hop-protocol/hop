import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import ProposalPreviewCard from 'src/pages/Vote/ProposalPreviewCard'

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

interface IProposalDetail {
  target: string
  functionSig: string
  callData: string
}

interface IProposal {
  id: string
  title: string
  description: string
  proposer: string
  status: string
  forCount: number
  againstCount: number
  startBlock: number
  endBlock: number
  details: IProposalDetail[]
}

type VoteProps = {
  proposals: IProposal[]
}


const Vote: FC<VoteProps> = props => {
  const { proposals } = props
  const styles = useStyles()

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
              id={proposal.id}
              description={proposal.description}
              status={proposal.status}
            />
        )}
    </Box>
  )
}

export default Vote
