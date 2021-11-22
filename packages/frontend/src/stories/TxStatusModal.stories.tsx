import React, { useEffect } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import TxStatusModal from 'src/components/modal/TxStatusModal'
import { storyTransactions } from './data'
import { createTransaction } from 'src/utils/createTransaction'
import useTxHistory from 'src/contexts/AppContext/useTxHistory'

export default {
  title: 'components/TxStatusModal',
  component: TxStatusModal,
} as ComponentMeta<typeof TxStatusModal>

const Template: ComponentStory<typeof TxStatusModal> = args => {
  const txHistory = useTxHistory()

  useEffect(() => {
    txHistory.setTransactions([...(txHistory.transactions || []), args.tx])
  }, [])

  function handleClose() {
    console.log('close')
  }

  return <TxStatusModal onClose={handleClose} {...args} />
}

const sts = storyTransactions.map((tx: any) =>
  createTransaction(tx, tx.networkName, tx.destNetworkName, tx.token, {
    pendingDestinationConfirmation: tx.pendingDestinationConfirmation,
    destTxHash: tx.destTxHash,
  })
)
console.log(`sts:`, sts)

export const PendingDestination = Template.bind({})
PendingDestination.args = {
  tx: sts[0],
}

export const BothCompleted = Template.bind({})
BothCompleted.args = {
  tx: sts[1],
}

export const PendingSource = Template.bind({})
PendingSource.args = {
  tx: sts[2],
}
