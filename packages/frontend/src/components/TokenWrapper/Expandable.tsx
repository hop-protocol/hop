import React, { FC, ChangeEvent, useMemo, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  details: {
    width: '46.0rem',
    marginBottom: '3.4rem',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  detailsDropdown: {
    width: '100%',
    '&[open] summary span::before': {
      content: '"▾"',
    },
  },
  detailsDropdownSummary: {
    listStyle: 'none',
    display: 'block',
    fontWeight: 'normal',
    '&::marker': {
      display: 'none',
    },
  },
  detailsDropdownLabel: {
    position: 'relative',
    cursor: 'pointer',
    '& > span': {
      position: 'relative',
      display: 'inline-flex',
      justifyItems: 'center',
      alignItems: 'center',
    },
    '& > span::before': {
      display: 'block',
      content: '"▸"',
      position: 'absolute',
      top: '0',
      right: '-1.5rem',
    },
  },
}))

export type Props = {
  title: string
  children?: any
}

const Expandable: FC<Props> = (props: Props) => {
  const { title, children } = props
  const styles = useStyles()
  return (
    <details className={styles.detailsDropdown}>
      <summary className={styles.detailsDropdownSummary}>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          component="div"
          className={styles.detailsDropdownLabel}
        >
          <span>{title}</span>
        </Typography>
      </summary>
      <div>{children}</div>
    </details>
  )
}

export default Expandable
