import React, { FC, useState } from 'react'
import PoolStats from './PoolStats'
import BonderStats from './BonderStats'
import PendingAmountStats from './PendingAmountStats'
import BalanceStats from './BalanceStats'
import DebitWindowStats from './DebitWindowStats'
import { Flex } from 'src/components/ui'
import { ChevronDown, ChevronUp } from 'react-feather'

function Title({ text, children }: any) {
  return (
    <Flex alignCenter fontSize={[2, 2, 3]} bold>
      {text || children}
    </Flex>
  )
}

function Group({ title, children, clickTitle }) {
  return (
    <Flex column alignCenter m={[0, 2, 4]} mb={[2, 4]}>
      <Flex alignCenter onClick={clickTitle} pointer mb={[1, 2]}>
        <Title text={title} />
        {children ? <ChevronUp /> : <ChevronDown />}
      </Flex>
      {children}
    </Flex>
  )
}

const initialState = {
  pool: true,
  balance: true,
  debitWindow: true,
  bonder: true,
  pendingAmount: true,
}

const Stats: FC = () => {
  const [groups, setGroups] = useState(initialState)

  function toggleGroup(group) {
    setGroups(val => ({ ...val, [group]: !val[group] }))
  }
  return (
    <Flex column alignCenter>
      <Flex flexDirection={['column', 'column', 'row']}>
        <Group title="Pool Stats" clickTitle={() => toggleGroup('pool')}>
          {groups.pool && <PoolStats />}
        </Group>

        <Group title="Native Token Balances" clickTitle={() => toggleGroup('balance')}>
          {groups.balance && <BalanceStats />}
        </Group>
      </Flex>

      <Group title="Debit Window Stats" clickTitle={() => toggleGroup('debitWindow')}>
        {groups.debitWindow && <DebitWindowStats />}
      </Group>

      <Group title="Bonder Stats" clickTitle={() => toggleGroup('bonder')}>
        {groups.bonder && <BonderStats />}
      </Group>

      <Group title="Pending Amount Stats" clickTitle={() => toggleGroup('pendingAmount')}>
        {groups.pendingAmount && <PendingAmountStats />}
      </Group>
    </Flex>
  )
}

export default Stats
