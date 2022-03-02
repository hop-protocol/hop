import React, { FC, useState } from 'react'
import PoolStats from './PoolStats'
import BonderStats from './BonderStats'
import PendingAmountStats from './PendingAmountStats'
import BalanceStats from './BalanceStats'
import DebitWindowStats from './DebitWindowStats'
import { Div, Flex } from 'src/components/ui'

function Title({ text, children }: any) {
  return (
    <Flex alignCenter fontSize={[2, 2, 3]} bold>
      {text || children}
    </Flex>
  )
}

function Group({ title, children, clickTitle, ...rest }) {
  return (
    <Flex justifyCenter alignCenter m={[1, 2, 4]} overflowX="scroll" {...rest}>
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
    <Flex
      flexDirection={['column', 'column', 'column', 'column', 'row']}
      alignItems={['center', 'center', 'center', 'center', 'flex-start']}
      fullWidth
    >
      <Flex $wrap justifyCenter flexDirection={['column', 'column', 'row']} fullWidth>
        <Flex $wrap justifyCenter fullWidth>
          <Group title="Pool Stats" clickTitle={() => toggleGroup('pool')} mr={[0, 2, 4]}>
            {groups.pool && <PoolStats />}
          </Group>

          <Flex
            flexDirection={['row', 'row', 'column']}
            $wrap
            alignCenter
            justifyCenter
            width={['100%', '100%', 'auto']}
          >
            <Group title="Native Token Balances" clickTitle={() => toggleGroup('balance')}>
              {groups.balance && <BalanceStats />}
            </Group>
            <Group title="Debit Window Stats" clickTitle={() => toggleGroup('debitWindow')}>
              {groups.debitWindow && <DebitWindowStats />}
            </Group>
          </Flex>
        </Flex>

        <Flex fullWidth justifyCenter>
          <Group title="Bonder Stats" clickTitle={() => toggleGroup('bonder')}>
            {groups.bonder && <BonderStats />}
          </Group>
        </Flex>
      </Flex>

      <Flex width={['100%', '100%', '50%']} mr={[0, 0, 4]}>
        <Group title="Pending Amount Stats" clickTitle={() => toggleGroup('pendingAmount')}>
          {groups.pendingAmount && <PendingAmountStats />}
        </Group>
      </Flex>
    </Flex>
  )
}

export default Stats
