import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import TransactionsList from 'src/components/accountDetails/TransactionsList'
import { createTransaction } from 'src/utils/createTransaction'
import { storyTransactions } from './data'
import { Div } from 'src/components/ui'

export default {
  title: 'components/TransactionsList',
  component: TransactionsList,
} as ComponentMeta<typeof TransactionsList>

const Template: ComponentStory<typeof TransactionsList> = args => {
  function handleClear() {
    console.log('clear')
  }

  const transactions = storyTransactions.map(tx =>
    createTransaction(tx, tx.networkName, tx.destNetworkName, tx.token)
  )

  return (
    <Div width="480px">
      <TransactionsList {...args} transactions={transactions} clear={handleClear} />
    </Div>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
