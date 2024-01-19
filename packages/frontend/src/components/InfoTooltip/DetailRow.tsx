import Box from '@material-ui/core/Box'
import React, { FC } from 'react'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
import { InfoTooltip } from 'src/components/InfoTooltip'
import { Theme, makeStyles } from '@material-ui/core/styles'

export type DetailRowProps = {
  title: string
  value?: any
  tooltip?: React.ReactNode
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

const useStyles = makeStyles<Theme, StyleProps>((theme: any) => {
  const label = {
    width: '100%',
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
      width: '100%',
    },
    label,
    xlabel: Object.assign(
      {
        fontSize: '2.8rem',
        textAlign: 'right',
        width: '100%',
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('xs')]: {
          fontSize: '2rem',
        },
      } as any,
      label
    ),
    mobileFlexColumn: {
      '@media (max-width: 550px)': {
        flexDirection: 'column',
        justifyContent: 'flex-end',
      },
    },
    noop: {}
  }
})

export const DetailRow: FC<DetailRowProps> = props => {
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
    <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" mt="1rem" className={xlarge ? styles.mobileFlexColumn : styles.noop}>
      <Typography
        variant={variant}
        color="textSecondary"
        className={clsx(styles.detailLabel, styles.label)}
      >
        <Box display="column" flexWrap="wrap">
          {title}&nbsp;
        </Box>
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
    </Box>
  )
}
