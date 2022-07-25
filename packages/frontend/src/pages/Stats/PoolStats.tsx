import React, { FC } from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { Div, Icon } from 'src/components/ui'
import { CellWrapper, SortableTable } from 'src/components/Table'
import { commafy } from 'src/utils'

function formatRatio(item) {
  const { reserve0, reserve1 } = item
  const div = reserve0 / reserve1
  return `${div.toString().slice(0, 6)}`
}

export const populatePoolStats = (item: any, extraData, i) => {
  return {
    chain: item.network.imageUrl,
    canonicalToken: item.reserve0,
    hToken: item.reserve1,
    tokenSymbol: item.token0.imageUrl,
    ratio: formatRatio(item),
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
            Cell: ({ cell }) => (
              <CellWrapper cell={cell}>
                <Icon src={cell.value} />
              </CellWrapper>
            ),
          },
          {
            Header: 'Token',
            accessor: 'canonicalToken',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                {commafy(cell.value)}
              </CellWrapper>
            ),
          },
          {
            Header: 'H Token',
            accessor: 'hToken',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                {commafy(cell.value)}
              </CellWrapper>
            ),
          },
          {
            Header: 'Ratio',
            accessor: 'ratio',
            Cell: ({ cell, ...rest }) => {
              return (
                <CellWrapper cell={cell}>
                  <Icon mr={1} src={cell.row.original.tokenSymbol} />
                  <Div justifySelf="right">{cell.value}</Div>
                </CellWrapper>
              )
            },
          },
        ],
      },
    ],
    []
  )

  return (
    <Div fontSize={[0, 1, 2]}>
      <SortableTable
        stats={poolStats}
        columns={columns}
        populateDataFn={populatePoolStats}
        extraData={poolStats}
        loading={fetching}
      />
    </Div>
  )
}

export default PoolStats
