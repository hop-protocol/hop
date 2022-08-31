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
    maxWidth: '100rem',
  },
}))

const InfoTooltip: FC<Props> = props => {
  const styles = useStyles()
  const children = props.children

  return (
    <Tooltip
      title={props.title}
      style={{
        opacity: 0.5,
        verticalAlign: 'middle',
        cursor: 'help',
        fontSize: '1.4rem',
        marginLeft: '0.2rem',
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
