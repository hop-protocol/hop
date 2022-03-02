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
    <Flex column justifyCenter alignCenter m={[1, 2, 4]} {...rest}>
      <Div borderRadius={'8px'}>{children}</Div>
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
    <Flex column alignCenter fullWidth>
      <Flex $wrap justifyCenter column fullWidth mr={[0, 0, 0, 100, 400]}>
        <Flex $wrap justifyCenter fullWidth>
          <Group title="Pool Stats" clickTitle={() => toggleGroup('pool')} mr={[0, 2, 4]}>
            {groups.pool && <PoolStats />}
          </Group>

          <Flex
            flexDirection={['row', 'column']}
            $wrap
            alignCenter
            width={['100%', 'auto', 'auto']}
          >
            <Group title="Native Token Balances" clickTitle={() => toggleGroup('balance')}>
              {groups.balance && <BalanceStats />}
            </Group>
            <Group
              title="Debit Window Stats"
              clickTitle={() => toggleGroup('debitWindow')}
              alignSelf={['flex-start', 'flex-start', 'center']}
            >
              {groups.debitWindow && <DebitWindowStats />}
            </Group>
          </Flex>
        </Flex>

        <Group
          title="Bonder Stats"
          clickTitle={() => toggleGroup('bonder')}
          alignSelf={['flex-start', 'flex-start', 'center']}
        >
          {groups.bonder && <BonderStats />}
        </Group>

        <Div
          width={['100%', '100%', '100%', '100%', 'auto']}
          position={['relative', 'relative', 'relative', 'relative', 'absolute']}
          right={[null, null, null, null, 0, 50]}
          top={70}
        >
          <Group title="Pending Amount Stats" clickTitle={() => toggleGroup('pendingAmount')}>
            {groups.pendingAmount && <PendingAmountStats />}
          </Group>
        </Div>
      </Flex>
    </Flex>
  )
}

export default Stats
