import React, { FC } from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { Div, Icon } from 'src/components/ui'
import SpacedTokenAmount from './components/SpacedTokenAmount'
import { CellWrapper, SortableTable } from 'src/components/Table'

function formatRatio(item) {
  const { reserve0, reserve1 } = item
  const div = reserve0 / reserve1
  return `${div.toString().slice(0, 6)}`
}

export const populatePoolStats = (item: any) => {
  return {
    chain: item.network.imageUrl,
    token: item,
    hToken: item,
    ratio: item,
  }
}

const PoolStats: FC = () => {
  const { stats: poolStats, fetching } = useStats()

  const columns = React.useMemo(
    () => [
      {
        Header: 'Pool Stats',
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
            Header: 'Token',
            accessor: 'token',
            Cell: ({ cell }) => {
              return (
                <CellWrapper cell={cell} end>
                  <SpacedTokenAmount
                    symbol={cell.value.token0.symbol}
                    amount={cell.value.reserve0}
                  />
                </CellWrapper>
              )
            },
          },
          {
            Header: 'H Token',
            accessor: 'hToken',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                <SpacedTokenAmount symbol={cell.value.token1.symbol} amount={cell.value.reserve1} />
              </CellWrapper>
            ),
          },
          {
            Header: 'Ratio',
            accessor: 'ratio',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell}>
                <Icon mr={1} src={cell.value.token0.imageUrl} width={[12, 18]} />
                <Div justifySelf="right">{formatRatio(cell.value)}</Div>
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
      <SortableTable stats={poolStats} columns={columns} populateDataFn={populatePoolStats} />
    </Div>
  )
}

export default PoolStats
