import React, { FC, ChangeEvent } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

type Props = {}

const HeaderRoutes: FC<Props> = () => {
  const { pathname } = useLocation()
  const history = useHistory()

  const handleChange = (event: ChangeEvent<{}>, value: string) => {
    event.preventDefault()
    history.push(value)
  }

  const value = pathname
    .split('/')
    .slice(0, 2)
    .join('/')

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab label="Send" value="/send" />
      <Tab label="Pool" value="/pool" />
      {/* <Tab label="Stake" value="/stake" /> */}
      {/* <Tab label="HOP" value="/earn" /> */}
      {/* <Tab label="Vote" value="/vote" /> */}
      <Tab label="Convert" value="/convert" />
      <Tab label="Faucet" value="/faucet" />
    </Tabs>
  )
}

export default HeaderRoutes
