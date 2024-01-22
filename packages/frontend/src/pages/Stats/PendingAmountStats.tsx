import React, { FC } from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy, formatTokenString } from 'src/utils'
import { Icon } from 'src/components/ui/Icon'
import Box from '@material-ui/core/Box'
import { CellWrapper, SortableTable } from 'src/components/Table'
import { NewTable } from 'src/components/Table/NewTable'

export const populatePendingAmountStats = (item: any) => {
  return {
    source: item.sourceNetwork?.imageUrl,
    destination: item.destinationNetwork?.imageUrl,
    pendingAmount: item.formattedPendingAmount,
    tokenDecimals: item.token.decimals,
    availableLiquidity: formatTokenString(item.availableLiquidity?.toString(), item.token?.decimals),
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
            Header: 'Destination',
            accessor: 'destination',
            width: 130,
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
            width: 160,
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
            width: 170,
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

  const error = pendingAmounts?.map((item: any) => item.error).filter(Boolean).join('\n')

  return (
    <Box>
      <NewTable columns={columns} stats={pendingAmounts.map(populatePendingAmountStats)} loading={fetchingPendingAmounts} error={error} height="3120px" />
      {/*
      <SortableTable
        stats={pendingAmounts}
        columns={columns}
        populateDataFn={populatePendingAmountStats}
        loading={fetchingPendingAmounts}
        error={error}
      />
      */}
    </Box>
  )
}

export default PendingAmountStats
