import React, { FC, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import LargeTextField from '../components/LargeTextField'

const useStyles = makeStyles(() => ({
  root: {
    width: '51.6rem',
    boxSizing: 'border-box'
  },
  topRow: {
    marginBottom: '1.8rem'
  }
}))

type Props = {
  value: string,
  balance?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
}

const AmountSelectorCard: FC<Props> = (props) => {
  const { value, balance, onChange } = props
  const styles = useStyles()

  return (
    <Card className={styles.root}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" className={styles.topRow}>
        <Typography variant="subtitle2" color="textSecondary">
          From
        </Typography>
        {balance ?
          <Typography variant="subtitle2" color="textSecondary">
            Balance: {balance}
          </Typography> :
          null
        }
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="flex-end">
        <LargeTextField
          value={value}
          onChange={onChange}
          placeholder="0.0"
        />
      </Box>
    </Card>
  )
}

export default AmountSelectorCard