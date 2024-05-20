import React from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

interface ITab {
  value: string
  label: string
}

interface Props {
  value: string | number
  onChange?: (index: string) => void
  tabs: ITab[]
}

const FlatTabs = (props: Props) => {
  const { value, onChange, tabs } = props
  const handleChange = (event: React.ChangeEvent<object>, newValue: string) => {
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <Tabs value={value} indicatorColor="primary" onChange={handleChange} aria-label="Tabs" centered>
      {tabs?.map((tab: ITab) => {
        const { label, value } = tab
        return <Tab key={value} label={label} value={value} />
      })}
    </Tabs>
  )
}

export default FlatTabs
