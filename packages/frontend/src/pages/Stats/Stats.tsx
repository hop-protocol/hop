import BalanceStats from 'src/pages/Stats/BalanceStats'
import BonderStats from 'src/pages/Stats/BonderStats'
import Box from '@mui/material/Box'
import DebitWindowStats from 'src/pages/Stats/DebitWindowStats'
import PendingAmountStats from 'src/pages/Stats/PendingAmountStats'
import PoolStats from 'src/pages/Stats/PoolStats'
import React, { FC, useState } from 'react'
import { useThemeMode } from 'src/theme/ThemeProvider'

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
