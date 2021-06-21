import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import InfoTooltip from 'src/components/infoTooltip'
import { DetailRow as DetailRowProps } from 'src/types'
import classnames from 'classnames'

const useStyles = makeStyles((theme) => ({
  detailLabel: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  highlight: {
    color: highlighted =>
      highlighted
        ? theme.palette.primary.main
        : theme.palette.text.primary
  }
}))

const DetailRow: FC<DetailRowProps> = props => {
  const {
    title,
    tooltip,
    value,
    highlighted = false
  } = props
  const styles = useStyles(highlighted)

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography
        variant="subtitle2"
        color="textSecondary"
        className={classnames(styles.detailLabel, styles.highlight)}
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
        className={styles.highlight}
      >
        {value || '-'}
      </Typography>
    </Box>
  )
}

export default DetailRow
