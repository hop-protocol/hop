import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemIcon: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
    marginRight: '1rem'
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  image: {
    width: 'auto',
    height: '3rem',
    objectFit: 'contain'
  }
}))

type Props = {
  value: string
  label: string
  icon: string
}

const SelectOption: FC<Props> = props => {
  const styles = useStyles()
  const { label, icon } = props

  return (
    <div className={styles.root}>
      <ListItemIcon className={styles.listItemIcon}>
        <Icon className={styles.icon}>
          <img src={icon} className={styles.image} alt="" />
        </Icon>
      </ListItemIcon>
      <Typography component="span" variant="h6">
        {label}
      </Typography>
    </div>
  )
}

export default SelectOption
