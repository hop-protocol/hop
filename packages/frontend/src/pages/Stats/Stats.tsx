import React, { FC, useState } from 'react'
import PoolStats from './PoolStats'
import BonderStats from './BonderStats'
import PendingAmountStats from './PendingAmountStats'
import BalanceStats from './BalanceStats'
import DebitWindowStats from './DebitWindowStats'
import { Flex } from 'src/components/ui'
import { useThemeMode } from 'src/theme/ThemeProvider'

function Group({ title, children, clickTitle, ...rest }) {
  return (
    <Flex alignCenter m={[1, 2, 4]} overflowX="scroll" {...rest}>
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
  const { isDarkMode } = useThemeMode()

  function toggleGroup(group) {
    setGroups(val => ({ ...val, [group]: !val[group] }))
  }
  return (
    <Flex
      color={isDarkMode ? 'secondary.main' : 'primary.default'}
      flexDirection={['column', 'column', 'column', 'column', 'row']}
      alignItems={['center', 'center', 'center', 'center', 'flex-start']}
      justifyContent={['flex-start', 'justify-between']}
      fullWidth
    >
      <Flex $wrap justifyCenter flexDirection={['column', 'column', 'column', 'row']} fullWidth>
        <Flex $wrap justifyCenter fullWidth>
          <Group title="Pool Stats" clickTitle={() => toggleGroup('pool')}>
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

      <Flex
        width={['auto', '100%', '100%', '50%']}
        justifyContent={['center', 'center', 'center', 'center', 'flex-start']}
      >
        <Group title="Pending Amount Stats" clickTitle={() => toggleGroup('pendingAmount')}>
          {groups.pendingAmount && <PendingAmountStats />}
        </Group>
      </Flex>
    </Flex>
  )
}

export default Stats
