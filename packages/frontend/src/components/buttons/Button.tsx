import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiButton, { ButtonProps as MuiButtonProps } from '@material-ui/core/Button'

type StyleProps = {
  highlighted: boolean
  large: boolean
  flat: boolean
}

export type ButtonProps = Partial<StyleProps> & MuiButtonProps

const useStyles = makeStyles((theme) => ({
  root: ({ highlighted, large, flat }: StyleProps) => ({
    borderRadius: '3.0rem',
    textTransform: 'none',
    padding: large ? '0.8rem 4.2rem' : '0.8rem 2.8rem',
    height: large ? '6.0rem' : '4.0rem',
    fontSize: large ? '2.2rem' : '1.6rem',
    color: highlighted
      ? 'white'
      : theme.palette.text.secondary,
    background: highlighted
      ? 'linear-gradient(127.75deg, #36BFEA 25.27%, #1AA7D3 71.82%)'
      : flat
      ? '#E2E2E5'
      : 'none',
    boxShadow: highlighted
      ? `
        -10px -10px 30px #FFFFFF,
        10px 10px 30px rgba(174, 174, 192, 0.4),
        inset -15px -15px 25px rgba(22, 156, 199, 0.15),
        inset 15px 15px 25px rgba(203, 243, 255, 0.1)
      `
      : flat
      ? 'none'
      : `
        -10px -10px 30px rgba(255, 255, 255, 0.95),
        10px 10px 30px rgba(174, 174, 192, 0.35)
      `,
    '&:hover': {
      background: highlighted
        ? 'linear-gradient(127.75deg, #4DC9F0 25.27%, #31B0D8 71.82%)'
        : flat
        ? '#E5E6Ea'
        : 'rgba(255, 255, 255, 0.2)'
    }
  }),
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
  const {
    className,
    children,
    highlighted = false,
    large = false,
    flat = false,
    ...buttonProps
  } = props
  const styles = useStyles({ highlighted, large, flat })

  return (
    <MuiButton
      {...buttonProps}
      className={`${styles.root} ${className}`}
      classes={{ disabled: styles.disabled}}
    >
      { children }
    </MuiButton>
  )
}

export default LargeButton