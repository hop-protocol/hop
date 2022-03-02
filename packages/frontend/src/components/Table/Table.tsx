import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useTable, useSortBy, sortTypes } from 'react-table'
import makeData from './makeData'

const Styles = styled.div`
  padding: 0.25rem;

  table {
    border-spacing: 0;
    border-radius: 8px;
    min-width: 90vw;

    @media screen and (min-width: 600px) {
      min-width: auto;
    }

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    tbody {
      > tr {
        &:hover {
          background-color: ${({ theme }) => theme.colors.action.hover};
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #dbdbdb;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setHiddenColumns,
    ...rest
  } = useTable(
    {
      columns,
      data,
      sortTypes,
    },
    useSortBy
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  // const firstPageRows = rows

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  {...column.getToggleHiddenProps()}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span style={{ color: '#B32EFF' }}>
                    {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

interface Props {
  stats: any
  columns: any[]
  populateDataFn: (item: any, ...rest: any) => void
  extraData?: any
}
function SortableTable(props: Props) {
  const { stats, columns, populateDataFn, extraData } = props

  const data = React.useMemo(() => makeData(stats, populateDataFn, extraData), [stats])

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export { SortableTable }
