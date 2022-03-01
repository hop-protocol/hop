import React, { FC } from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy, toTokenDisplay } from 'src/utils'
import { Div, Icon } from 'src/components/ui'
import { CellWrapper, RightAlignedValue, SortableTable } from 'src/components/Table'

export const populatePendingAmountStats = (item: any) => {
  return {
    source: item.sourceNetwork.imageUrl,
    destination: item.destinationNetwork.imageUrl,
    pendingAmount: commafy(item.formattedPendingAmount),
    availableLiquidity: toTokenDisplay(item.availableLiquidity, item.token.decimals),
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
                  <Icon src={cell.value} width={[12, 18]} />
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
                  <Icon src={cell.value} width={[12, 18]} />
                </CellWrapper>
              )
            },
          },
          {
            Header: 'Pending Amount',
            accessor: 'pendingAmount',
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Available Liquidity',
            accessor: 'availableLiquidity',
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Token',
            accessor: 'token',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell}>
                <Icon src={cell.value} width={[12, 18]} />
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
      />
    </Div>
  )
}

export default PendingAmountStats
