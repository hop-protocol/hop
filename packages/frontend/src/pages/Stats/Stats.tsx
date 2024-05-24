import BalanceStats from '#pages/Stats/BalanceStats.js'
import BonderStats from '#pages/Stats/BonderStats.js'
import Box from '@mui/material/Box'
import DebitWindowStats from '#pages/Stats/DebitWindowStats.js'
import PendingAmountStats from '#pages/Stats/PendingAmountStats.js'
import PoolStats from '#pages/Stats/PoolStats.js'
import React, { FC, useState } from 'react'
import { useThemeMode } from '#theme/ThemeProvider.js'

function Group({ title, children, clickTitle, ...rest }) {
  return (
    <Box justifyContent="center" overflow-x="scroll" {...rest}>
      {children}
    </Box>
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

  function toggleGroup(group: any) {
    setGroups(val => ({ ...val, [group]: !val[group] }))
  }

  return (
    <Box
      color={isDarkMode ? 'secondary.main' : 'primary.default'}
      maxWidth="1400px"
      margin="0 auto"
    >
      <Box display="flex" mb={4}>
        <Box display="flex" flexWrap="wrap" mb={4}>
          <Box display="flex" mb={4}>
            <Group mr={4} title="Pool Stats" clickTitle={() => toggleGroup('pool')}>
              {groups.pool && <PoolStats />}
            </Group>
          </Box>
          <Box display="flex" flexDirection="column">
            <Group mb={4} title="Native Token Balance" clickTitle={() => toggleGroup('balance')}>
              {groups.balance && <BalanceStats />}
            </Group>
            <Group title="Debit Window Stats" clickTitle={() => toggleGroup('debitWindow')}>
              {groups.debitWindow && <DebitWindowStats />}
            </Group>
          </Box>
          <Box>
            <Group title="Bonder Stats" clickTitle={() => toggleGroup('bonder')}>
              {groups.bonder && <BonderStats />}
            </Group>
          </Box>
        </Box>
      </Box>
      <Box>
        <Group title="Pending Amount Stats" clickTitle={() => toggleGroup('pendingAmount')}>
          {groups.pendingAmount && <PendingAmountStats />}
        </Group>
      </Box>
    </Box>
  )
}

export default Stats
