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
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                <Icon mr={1} src={cell.row.values.token} width={[12, 18]} />
                {commafy(cell.value)}
              </CellWrapper>
            ),
          },
          {
            Header: 'Token Decimals',
            accessor: 'tokenDecimals',
            Cell: props => {
              props.setHiddenColumns('tokenDecimals')
              return <Div>_</Div>
            },
          },
          {
            Header: 'Available Liquidity',
            accessor: 'availableLiquidity',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                <Icon mr={1} src={cell.row.values.token} width={[12, 18]} />
                {commafy(cell.value)}
              </CellWrapper>
            ),
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
    <Div fontSize={[0, 1, 2]} alignSelf={['center', 'center', 'flex-start']}>
      <SortableTable
        stats={pendingAmounts}
        columns={columns}
        populateDataFn={populatePendingAmountStats}
      />
    </Div>
  )
}

export default PendingAmountStats
