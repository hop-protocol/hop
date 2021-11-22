import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TransactionsList } from 'src/components/Transaction'
import { createTransaction } from 'src/utils/createTransaction'
import { storyTransactions } from './data'
import { Div } from 'src/components/ui'
import { Token } from '@hop-protocol/sdk'
import Transaction from 'src/models/Transaction'

export default {
  title: 'components/TransactionsList',
  component: TransactionsList,
} as ComponentMeta<typeof TransactionsList>

const Template: ComponentStory<typeof TransactionsList> = args => {
  const transactions = (storyTransactions as Transaction[]).map((tx: any) =>
    createTransaction(tx, tx.networkName, tx.destNetworkName, tx.token as Token)
  )

  return (
    <Div width="480px">
      <TransactionsList {...args} transactions={transactions} />
    </Div>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
