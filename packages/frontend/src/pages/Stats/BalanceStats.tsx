import React, { FC } from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy } from 'src/utils'
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'
import { Div, Icon } from 'src/components/ui'
import { CellWrapper, SortableTable } from 'src/components/Table'

export const populatePoolStats = (item: any) => {
  return {
    chain: item.network.imageUrl,
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
            Cell: ({ cell }) => {
              return (
                <CellWrapper cell={cell}>
                  <Icon src={cell.value} width={[12, 18]} />
                </CellWrapper>
              )
            },
          },
          {
            Header: 'Name',
            accessor: 'name',
            Cell: ({ cell }) => {
              return <CellWrapper cell={cell}>{cell.value}</CellWrapper>
            },
          },
          {
            Header: 'Address',
            accessor: 'address',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                <CopyEthAddress value={cell.value} />
              </CellWrapper>
            ),
          },
          {
            Header: 'Balance',
            accessor: 'balance',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                {cell.value}
              </CellWrapper>
            ),
          },
        ],
      },
    ],
    []
  )

  return (
    <Div fontSize={[0, 1, 2]}>
      <SortableTable stats={balances} columns={columns} populateDataFn={populatePoolStats} />
    </Div>
  )
}

export default BalanceStats
