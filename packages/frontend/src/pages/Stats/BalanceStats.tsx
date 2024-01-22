import React, { FC } from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy } from 'src/utils'
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'
import { Icon } from 'src/components/ui/Icon'
import Box from '@material-ui/core/Box'
import { CellWrapper, SortableTable } from 'src/components/Table'
import ethLogo from 'src/assets/logos/eth.svg'
import { NewTable } from 'src/components/Table/NewTable'

export const populatePoolStats = (item: any) => {
  return {
    chain: item.network?.imageUrl,
    name: item.name,
    address: item.address,
    balance: commafy(item.balance),
  }
}
const BalanceStats: FC = () => {
  const { balances, fetchingBalances } = useStats()

  const columns = React.useMemo(
    () => [
      {
        Header: 'Native Token Balances',
        columns: [
          {
            Header: 'Chain',
            accessor: 'chain',
            width: 100,
            Cell: ({ cell }) => {
              return (
                <CellWrapper cell={cell}>
                  <Icon src={cell.value} />
                </CellWrapper>
              )
            },
          },
          {
            Header: 'Name',
            accessor: 'name',
            width: 160,
            Cell: ({ cell }) => {
              return <CellWrapper cell={cell}>{cell.value}</CellWrapper>
            },
          },
          {
            Header: 'Address',
            accessor: 'address',
            width: 110,
            Cell: ({ cell }) => (
              <CellWrapper cell={cell}>
                <CopyEthAddress value={cell.value} />
              </CellWrapper>
            ),
          },
          {
            Header: 'Balance',
            accessor: 'balance',
            width: 110,
            Cell: ({ cell }) => (
              <CellWrapper cell={cell}>
                <Icon mr={1} src={ethLogo} />
                {commafy(cell.value)}
              </CellWrapper>
            ),
          },
        ],
      },
    ],
    []
  )

  const error = balances?.map((item: any) => item.error).filter(Boolean).join('\n')

  return (
    <Box>
      <NewTable columns={columns} stats={balances.map(populatePoolStats)} loading={fetchingBalances} error={error} height="440px" />
      {/*
      <SortableTable
        stats={balances}
        columns={columns}
        populateDataFn={populatePoolStats}
        loading={fetchingBalances}
        error={error}
      />
      */}
    </Box>
  )
}

export default BalanceStats
