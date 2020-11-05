import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button, { ButtonProps } from '@material-ui/core/Button'

const useStyles = makeStyles(() => ({
  root: {
    height: '6.0rem',
    color: 'white',
    background: 'linear-gradient(127.75deg, #36BFEA 25.27%, #1AA7D3 71.82%)',
    boxShadow: `
      -10px -10px 30px #FFFFFF,
      10px 10px 30px rgba(174, 174, 192, 0.4),
      inset -15px -15px 25px rgba(22, 156, 199, 0.15),
      inset 15px 15px 25px rgba(203, 243, 255, 0.1)
    `,
    borderRadius: '3.0rem',
    padding: '0.8rem 1.8rem'
  },
  disabled: {
    color: '#46525C',
    background: 'none',
    boxShadow: `
      -10px -10px 30px rgba(255, 255, 255, 0.95),
      10px 10px 30px rgba(174, 174, 192, 0.35)
    `,
  }
}))

const LargeButton: FC<ButtonProps> = (props) => {
  const { className, children } = props
  const styles = useStyles()

  return (
    <Button {...props} className={`${styles.root} ${className}`} classes={{ disabled: styles.disabled}}>
      { children }
    </Button>
  )
}

export default LargeButton