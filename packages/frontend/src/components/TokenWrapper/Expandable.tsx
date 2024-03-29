import React, { FC } from 'react'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  details: {
    width: '46.0rem',
    marginBottom: '3.4rem',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  detailsDropdown: {
    margin: '1rem 0',
    padding: '1rem',
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
    '&:hover': {
      fontWeight: 'bold'
    },
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
