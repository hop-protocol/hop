import React, { FC } from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy, formatTokenString } from 'src/utils'
import { Div, Icon } from 'src/components/ui'
import { CellWrapper, SortableTable } from 'src/components/Table'

export const populatePendingAmountStats = (item: any) => {
  return {
    source: item.sourceNetwork.imageUrl,
    destination: item.destinationNetwork.imageUrl,
    pendingAmount: item.formattedPendingAmount,
    tokenDecimals: item.token.decimals,
    availableLiquidity: formatTokenString(item.availableLiquidity.toString(), item.token.decimals),
    token: item.token.imageUrl,
  }
}

const PendingAmountStats: FC = () => {
  const { pendingAmounts, fetchingPendingAmounts } = useStats()

  const columns = React.useMemo(
    () => [
      {
        Header: 'Pending Amount Stats',
        columns: [
          {
            Header: 'Source',
            accessor: 'source',
            Cell: ({ cell }) => {
              return (
                <CellWrapper cell={cell}>
                  <Icon src={cell.value} />
                </CellWrapper>
              )
            },
          },
          {
            Header: 'Destination',
            accessor: 'destination',
            Cell: ({ cell }) => {
              return (
                <CellWrapper cell={cell}>
                  <Icon src={cell.value} />
                </CellWrapper>
              )
            },
          },
          {
            Header: 'Pending Amount',
            accessor: 'pendingAmount',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                <Icon mr={1} src={cell.row.original.token} />
                {commafy(cell.value)}
              </CellWrapper>
            ),
          },
          {
            Header: 'Available Liquidity',
            accessor: 'availableLiquidity',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                <Icon mr={1} src={cell.row.original.token} />
                {commafy(cell.value)}
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
      <SortableTable
        stats={pendingAmounts}
        columns={columns}
        populateDataFn={populatePendingAmountStats}
        loading={fetchingPendingAmounts}
      />
    </Div>
  )
}

export default PendingAmountStats
