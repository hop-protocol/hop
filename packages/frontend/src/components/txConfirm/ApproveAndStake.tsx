import React from 'react'
import Button from 'src/components/buttons/Button'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(() => ({
  root: {
  },
  image: {
    width: '24px'
  },
  label: {
    'white-space': 'nowrap'
  },
  boxWrapper: {
    background: '#fff',
    borderRadius: '2rem'
  }
}))

interface Props {
  token: any
  total: string
  onConfirm: (confirmed: boolean) => void
}

export function ApproveAndStake (props: Props) {
  const { onConfirm, token, total } = props
  const styles = useStyles()

  function handleStake() {
    onConfirm(true)
  }

  const tokenAmount = token.amount
  const tokenImageUrl = token.token.imageUrl
  const tokenSymbol = token.token.symbol

  return (
    <Box className={styles.root} margin="0 auto" maxWidth="350px">
      <Box mb={4} display="flex" justifyContent="center" alignItems="center" textAlign="center">
        <Typography variant="h5">
          Confirm Stake
        </Typography>
      </Box>
      <Box mb={4} p={2} className={styles.boxWrapper}>
        <Box mb={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            {!!tokenImageUrl && (
              <Box mr={1} display="flex" alignItems="center">
                <img className={styles.image} src={tokenImageUrl} alt={tokenSymbol} title={tokenSymbol} />
              </Box>
            )}
            <Box mr={1} display="flex" alignItems="center">
              <Typography variant="subtitle1" className={styles.label}>
                {tokenAmount} {tokenSymbol}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5">
            Total
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5">
            {total}
          </Typography>
        </Box>
      </Box>
      <Box mb={4} justifyContent="center" alignItems="center">
        <Button
          onClick={handleStake}
          fullWidth
          large
          highlighted
        >
          Stake
        </Button>
      </Box>
    </Box>
  )
}
