import React, { FC } from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy, formatTokenString } from 'src/utils'
import { Icon } from 'src/components/ui/Icon'
import Box from '@material-ui/core/Box'
import { CellWrapper, SortableTable } from 'src/components/Table'

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

  const error = pendingAmounts?.map((item: any) => item.error).filter(Boolean).join('\n')

  return (
    <Box>
      <SortableTable
        stats={pendingAmounts}
        columns={columns}
        populateDataFn={populatePendingAmountStats}
        loading={fetchingPendingAmounts}
        error={error}
      />
    </Box>
  )
}

export default PendingAmountStats
