import React, { FC, ReactFragment } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import InfoTooltip from 'src/components/InfoTooltip'
import classnames from 'classnames'
import { Flex } from '../ui'

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
    detailLabel: {
      display: 'flex',
      alignItems: 'center',
    },
    label,
    xlabel: Object.assign(
      {
        fontSize: '2.8rem',
        textAlign: 'right',
        [theme.breakpoints.down('xs')]: {
          fontSize: '2rem',
        },
      } as any,
      label
    ),
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
  const variant = xlarge || large ? 'h6' : 'subtitle2'

  return (
    <Flex justifyBetween alignCenter fullWidth mt="1rem">
      <Typography
        variant={variant}
        color="textSecondary"
        className={classnames(styles.detailLabel, styles.label)}
      >
        <Flex $wrap maxWidth={[100, 1000]}>
          {title}&nbsp;
        </Flex>
        {tooltip ? <InfoTooltip title={tooltip} /> : null}
      </Typography>
      <Typography
        align="right"
        variant={variant}
        color="textSecondary"
        className={xlarge ? styles.xlabel : styles.label}
      >
        {value || '•'}
      </Typography>
    </Flex>
  )
}

export default DetailRow
