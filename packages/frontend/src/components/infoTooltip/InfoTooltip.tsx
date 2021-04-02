import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import HelpIcon from '@material-ui/icons/Help'

type Props = {
  title: string
  placement?:
    | 'bottom'
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | undefined
}

export default function HelpTooltip (props: Props) {
  return (
    <Tooltip
      style={{
        opacity: 0.5,
        verticalAlign: 'middle',
        cursor: 'help',
        fontSize: '1.4rem',
        marginLeft: '0.2rem'
      }}
      title={props.title}
      placement={props.placement || 'top'}
      arrow={true}
    >
      <HelpIcon />
    </Tooltip>
  )
}
