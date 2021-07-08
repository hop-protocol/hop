import React, { FC, ReactFragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip'
import HelpIcon from '@material-ui/icons/Help'

type Props = {
  title: ReactFragment
} & Partial<TooltipProps>

const useStyles = makeStyles(theme => ({
  tooltip: {
    maxWidth: '100.0rem'
  }
}))

const HelpTooltip: FC<Props> = props => {
  const styles = useStyles()

  return (
    <Tooltip
      {...props}
      style={{
        opacity: 0.5,
        verticalAlign: 'middle',
        cursor: 'help',
        fontSize: '1.4rem',
        marginLeft: '0.2rem',
        maxWidth: '100.0rem'
      }}
      classes={{
        tooltip: styles.tooltip
      }}
      placement={props.placement || 'top'}
      arrow={true}
    >
      <HelpIcon />
    </Tooltip>
  )
}

export default HelpTooltip
