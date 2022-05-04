import React, { FC, ChangeEvent } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { isMainnet } from 'src/config'

const HeaderRoutes: FC = () => {
  const { pathname, search } = useLocation()
  const history = useHistory()

  const handleChange = (event: ChangeEvent<{}>, newValue: string) => {
    event.preventDefault()
    history.push({
      pathname: newValue,
      search,
    })
  }

  const value = pathname.split('/').slice(0, 2).join('/')

  return (
    <Tabs value={value || '/send'} onChange={handleChange}>
      <Tab label="Send" value="/send" />
      <Tab label="Pool" value="/pool" />
      <Tab label="Convert" value="/convert" />
      <Tab label="Stake" value="/stake" />
      <Tab label="Airdrop" value="/airdrop" />
      {!isMainnet && <Tab label="Faucet" value="/faucet" />}
    </Tabs>
  )
}

export default HeaderRoutes
