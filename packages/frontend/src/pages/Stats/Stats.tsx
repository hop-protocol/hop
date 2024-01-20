import React, { FC, useState } from 'react'
import PoolStats from 'src/pages/Stats/PoolStats'
import BonderStats from 'src/pages/Stats/BonderStats'
import PendingAmountStats from 'src/pages/Stats/PendingAmountStats'
import BalanceStats from 'src/pages/Stats/BalanceStats'
import DebitWindowStats from 'src/pages/Stats/DebitWindowStats'
import Box from '@material-ui/core/Box'
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
      <Box display="flex" flexDirection="column" mb={4} width="100%">

        <Box display="flex" width="100%" mb={4}>
          <Box display="flex" width="50%"mr={4}>
            <Group title="Pool Stats" clickTitle={() => toggleGroup('pool')} width="100%">
              {groups.pool && <PoolStats />}
            </Group>
          </Box>
          <Box display="flex" width="50%">
            <Group title="Native Token Balance" clickTitle={() => toggleGroup('balance')} width="100%">
              {groups.balance && <BalanceStats />}
            </Group>
          </Box>
        </Box>

        <Box display="flex" width="100%" mb={4}>
          <Group title="Debit Window Stats" clickTitle={() => toggleGroup('debitWindow')} width="100%">
            {groups.debitWindow && <DebitWindowStats />}
          </Group>
        </Box>

        <Box display="flex" width="100%" mb={4}>
          <Group title="Bonder Stats" clickTitle={() => toggleGroup('bonder')} width="100%">
            {groups.bonder && <BonderStats />}
          </Group>
        </Box>

        <Box display="flex" width="100%">
          <Group title="Pending Amount Stats" clickTitle={() => toggleGroup('pendingAmount')} width="100%">
            {groups.pendingAmount && <PendingAmountStats />}
          </Group>
        </Box>
      </Box>
    </Box>
  )
}

export default Stats
