import HelpIcon from '@mui/icons-material/Help'
import React, { FC, useState } from 'react'
import Tooltip, { TooltipProps } from '@mui/material/Tooltip'
import { makeStyles } from '@mui/styles'

type Props = {
  title: React.ReactNode
  children?: any
} & Partial<TooltipProps>

const useStyles = makeStyles((theme: any) => ({
  tooltip: {
    maxWidth: '100rem',
  },
  icon: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '2rem !important',
    },
  },
}))

export const InfoTooltip: FC<Props> = (props: any) => {
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const styles = useStyles()
  const children = props.children

  return (
    <Tooltip
      open={tooltipIsOpen}
      onOpen={() => setTooltipIsOpen(true)}
      onClose={() => setTooltipIsOpen(false)}
      title={props.title}
      style={children ? ({}) : {
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
      onClick={() => setTooltipIsOpen(!tooltipIsOpen)}
    >
      {children || <HelpIcon color="secondary" className={styles.icon} />}
    </Tooltip>
  )
}
