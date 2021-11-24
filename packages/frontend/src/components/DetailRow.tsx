import React, { FC, ReactFragment } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import InfoTooltip from 'src/components/infoTooltip'
import classnames from 'classnames'

export type DetailRowProps = {
  title: string
  value: string | undefined
  tooltip?: ReactFragment
  highlighted?: boolean
  large?: boolean
  xlarge?: boolean
  bold?: boolean
  contrastText?: boolean
}

type StyleProps = {
  highlighted: boolean
  bold: boolean
  contrastText: boolean
}

const useStyles = makeStyles<Theme, StyleProps>(theme => {
  const label = {
    color: ({ highlighted, contrastText }) => {
      if (highlighted) {
        return theme.palette.primary.main
      } else if (contrastText) {
        return 'white'
      } else {
        return theme.palette.text.secondary
      }
    },
    fontWeight: ({ bold }) => (bold ? 800 : 700),
  }

  return {
    box: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailLabel: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    label,
    xlabel: Object.assign({
      fontSize: '2.8rem'
    }, label)
  }
})

const DetailRow: FC<DetailRowProps> = props => {
  const {
    title,
    tooltip,
    value,
    highlighted = false,
    large = false,
    xlarge = false,
    bold = false,
    contrastText = false,
  } = props
  const styles = useStyles({ highlighted, bold, contrastText })
  const variant : any = xlarge || large ? 'h6' : 'subtitle2'

  return (
    <Box className={styles.box}>
      <Typography
        variant={variant}
        color="textSecondary"
        className={classnames(styles.detailLabel, styles.label)}
      >
        {title + ' '}
        {tooltip ? <InfoTooltip title={tooltip} /> : null}
      </Typography>
      <Typography
        variant={variant}
        color="textSecondary"
        className={xlarge ? styles.xlabel : styles.label}
      >
        {value || '•'}
      </Typography>
    </Box>
  )
}

export default DetailRow
