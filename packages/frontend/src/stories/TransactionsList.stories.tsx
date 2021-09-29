import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TransactionsList } from 'src/components/accountDetails/AccountDetails'
import { useApp } from 'src/contexts/AppContext'

export default {
  title: 'components/TransactionsList',
  component: TransactionsList,
} as ComponentMeta<typeof TransactionsList>

const Template: ComponentStory<typeof TransactionsList> = args => {
  function handleClear() {
    console.log('clear')
  }
  const app = useApp()
  const txs = app.txHistory?.transactions
  return <TransactionsList transactions={txs} onClear={handleClear} {...args} />
}

export const Basic = Template.bind({})
Basic.args = {}
