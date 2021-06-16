import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import InfoTooltip from 'src/components/infoTooltip'

const useStyles = makeStyles(() => ({
  detailLabel: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
}))

type DetailRowProps = {
  title: string
  tooltip?: string
  value?: string
}

const DetailRow: FC<DetailRowProps> = props => {
  const {
    title,
    tooltip,
    value
  } = props
  const styles = useStyles()

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography
        variant="subtitle2"
        color="textSecondary"
        className={styles.detailLabel}
      >
        {title + ' '}
        {
          tooltip
            ? <InfoTooltip title={tooltip} />
            : null
        }
      </Typography>
      <Typography
        variant="subtitle2"
        color="textSecondary"
      >
        {value || '-'}
      </Typography>
    </Box>
  )
}

export default DetailRow
