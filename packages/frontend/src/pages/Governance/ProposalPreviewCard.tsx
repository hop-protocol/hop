import React, { FC, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

type StyleProps = {
  status: string
}

const statusColors = {
  green: 'rgba(75, 181, 67)',
  red: 'rgba(252, 16, 13)'
}

const useStyles = makeStyles(theme => ({
  previewsBox: {
    width: '51.6rem',
    marginBottom: '2rem'
  },
  previewBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  previewCard: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  proposalStatus: ({ status }: StyleProps) => ({
    fontSize: '0.825rem',
    padding: '0.5rem',
    width: '10rem',
    textAlign: 'center',
    justifySelf: 'flex-end',
    textTransform: 'uppercase',
    borderRadius: '1.5rem',
    boxShadow: status === 'passed'
    ?
    `
      inset -3px -3px 6px ${statusColors.green},
      inset 3px 3px 6px rgba(174, 192, 177, 0.16)
    `
    :
    `
      inset -3px -3px 6px ${statusColors.red},
      inset 3px 3px 6px rgba(174, 192, 177, 0.16)
    `
  })
}))

type Props = {
  index: string
  description: string
  status: string
  onClick?: (event: ChangeEvent<HTMLInputElement>) => void
}

const ProposalPreviewCard: FC<Props> = props => {
  const { index, description, status } = props
  const styles = useStyles({ status })

  return (
    <Box alignItems="center" className={styles.previewsBox}>
      <Card className={styles.previewCard}>
          <Box alignItems="center" className={styles.previewBox}>
          <Typography
              variant="subtitle2"
              color="textSecondary"
              component="div"
          >
              { index }
          </Typography>
          </Box>
          <Box alignItems="left" className={styles.previewBox}>
          <Typography
              variant="subtitle2"
              color="textSecondary"
              component="div"
          >
            { description }
          </Typography>
          </Box>
          <Box alignItems="center" className={`${styles.proposalStatus}`}>
            <Typography
                variant="subtitle2"
                color="textSecondary"
                component="div"
            >
              { status }
            </Typography>
          </Box>
      </Card>
    </Box>
  )
}

export default ProposalPreviewCard
