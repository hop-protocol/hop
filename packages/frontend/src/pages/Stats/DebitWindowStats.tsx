import React, { FC } from 'react'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy } from 'src/utils'
import { Icon } from 'src/components/ui/Icon'
import Box from '@mui/material/Box'
import { CellWrapper, RightAlignedValue, SortableTable } from 'src/components/Table'

export const populateDebitWindowStats = (item: any, bonderStats: any, i: number) => {
  return {
    token: item.token?.imageUrl,
    slot0: item.amountBonded?.[0],
    slot1: item.amountBonded?.[1],
    slot2: item.amountBonded?.[2],
    slot3: item.amountBonded?.[3],
    slot4: item.amountBonded?.[4],
    slot5: item.amountBonded?.[5],
    minutes: item.remainingMin,
    virtualDebt: bonderStats?.[i]?.virtualDebt
  }
}

const DebitWindowStats: FC = () => {
  const { debitWindowStats, bonderStats, fetchingDebitWindowStats } = useStats()

  const columns = React.useMemo(
    () => [
      {
        Header: 'Debit Window Stats',
        columns: [
          {
            Header: 'Token',
            accessor: 'token',
            Cell: ({ cell }) => {
              return (
                <CellWrapper cell={cell}>
                  <Icon src={cell.value} />
                </CellWrapper>
              )
            },
          },
          {
            Header: 'Slot 0',
            accessor: 'slot0',
            Cell: ({ cell }) => {
              return <RightAlignedValue cell={cell} />
            },
          },
          {
            Header: 'Slot 1',
            accessor: 'slot1',
            Cell: ({ cell }) => {
              return <RightAlignedValue cell={cell} />
            },
          },
          {
            Header: 'Slot 2',
            accessor: 'slot2',
            Cell: ({ cell }) => {
              return <RightAlignedValue cell={cell} />
            },
          },
          {
            Header: 'Slot 3',
            accessor: 'slot3',
            Cell: ({ cell }) => {
              return <RightAlignedValue cell={cell} />
            },
          },
          {
            Header: 'Slot 4',
            accessor: 'slot4',
            Cell: ({ cell }) => {
              return <RightAlignedValue cell={cell} />
            },
          },
          {
            Header: 'Slot 5',
            accessor: 'slot5',
            Cell: ({ cell }) => {
              return <RightAlignedValue cell={cell} />
            },
          },
          {
            Header: 'Minutes',
            accessor: 'minutes',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                {cell.value}
              </CellWrapper>
            ),
          },
          {
            Header: 'Virtual Debt',
            accessor: 'virtualDebt',
            Cell: ({ cell }) => (
              <CellWrapper cell={cell} end>
                <Icon mr={1} src={cell.row.values.token} />
                {cell.value && <>{commafy(cell.value)}</>}
              </CellWrapper>
            ),
          },
        ],
      },
    ],
    [bonderStats]
  )

  const error = debitWindowStats?.map((item: any) => item.error).filter(Boolean).join('\n')

  return (
    <Box overflow-x="scroll">
      <SortableTable
        stats={debitWindowStats}
        columns={columns}
        populateDataFn={populateDebitWindowStats}
        extraData={bonderStats}
        loading={fetchingDebitWindowStats}
        error={error}
      />
    </Box>
  )
}

export default DebitWindowStats
