import React, { FC, ReactFragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip'
import HelpIcon from '@material-ui/icons/Help'

type Props = {
  title: ReactFragment
  children?: any
} & Partial<TooltipProps>

const useStyles = makeStyles(theme => ({
  tooltip: {
    maxWidth: '1000px',
  },
}))

const InfoTooltip: FC<Props> = props => {
  const styles = useStyles()
  const children = props.children

  return (
    <Tooltip
      title={props.title}
      style={children ? ({}) : {
        opacity: 0.5,
        verticalAlign: 'middle',
        cursor: 'help',
        fontSize: '14px',
        marginLeft: '2px',
      }}
      classes={{
        tooltip: styles.tooltip,
      }}
      placement={props.placement || 'top'}
      arrow={true}
    >
      {children || <HelpIcon color="secondary" />}
    </Tooltip>
  )
}

export default InfoTooltip
