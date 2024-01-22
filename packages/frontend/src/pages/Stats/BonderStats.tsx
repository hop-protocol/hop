import React from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { Icon } from 'src/components/ui/Icon'
import Box from '@material-ui/core/Box'
import { RightAlignedValue, SortableTable } from 'src/components/Table'
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'
import { NewTable } from 'src/components/Table/NewTable'

export const populateBonderStats = (item: any) => {
  return {
    chain: item.network?.imageUrl,
    token: item.token?.imageUrl,
    bonder: item.bonder,
    credit: item.credit,
    debit: item.debit,
    availableLiquidity: item.availableLiquidity,
    pendingAmount: item.pendingAmount,
    totalAmount: item.totalAmount,
    availableNative: item.availableNative,
    vaultBalance: item.vaultBalance,
  }
}

function BonderStats() {
  const { bonderStats, fetchingBonderStats } = useStats()

  const columns = React.useMemo(
    () => [
      {
        Header: 'Bonder Stats',
        columns: [
          {
            Header: 'Chain',
            accessor: 'chain',
            width: 100,
            Cell: ({ cell }) => {
              return (
                <Box display="flex" justifyContent="center">
                  <Icon src={cell.value} />
                </Box>
              )
            },
          },
          {
            Header: 'Token',
            accessor: 'token',
            width: 100,
            Cell: ({ cell }) => {
              return (
                <Box display="flex" justifyContent="center">
                  <Icon src={cell.value} />
                </Box>
              )
            },
          },
          {
            Header: 'Bonder',
            accessor: 'bonder',
            width: 120,
            Cell: ({ cell }) => {
              return (
                <Box display="flex" justifyContent="center">
                  <CopyEthAddress value={cell.value} />
                </Box>
              )
            },
          },
          {
            Header: 'Credit',
            accessor: 'credit',
            width: 100,
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Debit',
            accessor: 'debit',
            width: 100,
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Available Liquidity',
            accessor: 'availableLiquidity',
            width: 170,
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Pending Amount',
            accessor: 'pendingAmount',
            width: 160,
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Total Amount',
            accessor: 'totalAmount',
            width: 140,
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Available Native',
            accessor: 'availableNative',
            width: 160,
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Vault Balance',
            accessor: 'vaultBalance',
            width: 140,
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
        ],
      },
    ],
    []
  )

  const error = bonderStats?.map((item: any) => item.error).filter(Boolean).join('\n')

  return (
    <Box overflow-x="scroll" alignSelf="center">
      <NewTable columns={columns} stats={bonderStats.map(populateBonderStats)} loading={fetchingBonderStats} error={error} height="1540px" />
      {/*
      <SortableTable
        stats={bonderStats}
        columns={columns}
        populateDataFn={populateBonderStats}
        loading={fetchingBonderStats}
        error={error}
      />
      */}
    </Box>
  )
}

export default BonderStats
