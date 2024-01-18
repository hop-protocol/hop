import React, { FC } from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { Icon } from 'src/components/ui/Icon'
import Box from '@material-ui/core/Box'
import { CellWrapper, SortableTable } from 'src/components/Table'
import { commafy } from 'src/utils'

function formatRatio(item: any) {
  const { reserve0, reserve1 } = item
  if (!(reserve0 && reserve1)) {
    return ''
  }
  const div = reserve0 / reserve1
  return `${div.toString().slice(0, 6)}`
}

export const populatePoolStats = (item: any, extraData: any, i: number) => {
  return {
    chain: item.network?.imageUrl,
    canonicalToken: item.reserve0,
    hToken: item.reserve1,
    tokenSymbol: item.token0?.imageUrl,
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
                  <Box justifySelf="right">{cell.value}</Box>
                </CellWrapper>
              )
            },
          },
        ],
      },
    ],
    []
  )

  const error = poolStats?.map((item: any) => item.error).filter(Boolean).join('\n')

  return (
    <Box>
      <SortableTable
        stats={poolStats}
        columns={columns}
        populateDataFn={populatePoolStats}
        extraData={poolStats}
        loading={fetching}
        error={error}
      />
    </Box>
  )
}

export default PoolStats
