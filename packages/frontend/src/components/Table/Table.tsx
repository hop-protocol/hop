import Alert from '@mui/lab/Alert'
import Box from '@mui/material/Box'
import React from 'react'
import Skeleton from '@mui/lab/Skeleton'
import Typography from '@mui/material/Typography'
import makeData from './makeData'
import styled from 'styled-components'
import { useSortBy, useTable } from 'react-table'

const Styles = styled.div`
  padding: 0.25rem;

  table {
    border-spacing: 0;
    border-radius: 8px;
    min-width: 85vw;

    @media screen and (min-width: 600px) {
      min-width: 70vw;
    }

    @media screen and (min-width: 960px) {
      min-width: 500px;
    }

    @media screen and (min-width: 1280px) {
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
        :first-child {
          background-color: transparent;
        }
        :nth-child(odd) {
          background-color: ${({ theme }) => theme.colors.background.contrast};
        }

        &:hover {
          background-color: ${({ theme }) => theme.colors.action.hover};
          color: black;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid #dbdbdb;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data, loading }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  )

  return (
    <Box width="100%">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any, i) => (
            <tr
              {...headerGroup.getHeaderGroupProps([
                {
                  style: {
                    ...headerGroup.style,
                    textAlign: i === 0 ? 'left' : 'center',
                    fontSize: i === 0 ? '2rem' : '1.5rem',
                    color: i === 0 ? '#B32EFF' : 'inherit',
                  },
                },
              ])}
            >
              {headerGroup.headers.map((column: any, i) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps(), [
                    {
                      style: {
                        ...column.style,
                        backgroundColor: (column).isSorted ? '#eed0ff' : 'transparent',
                      },
                    },
                  ])}
                >
                  {column.render('Header')}
                  <span style={{ color: '#B32EFF' }}>
                    {column.isSorted ? ' ↑' : column.isSortedDesc && ' ↓'}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {loading && (
            <tr>
              <td colSpan={headerGroups?.[1].headers?.length}>
                <Skeleton animation="wave" width={'100%'} />
              </td>
            </tr>
          )}
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
    </Box>
  )
}

interface Props {
  stats: any
  columns: any[]
  populateDataFn: (item: any, ...rest: any) => void
  extraData?: any
  loading?: boolean
  error?: string
}

function SortableTable(props: Props) {
  const { stats, columns, populateDataFn, extraData, loading, error } = props

  const data = React.useMemo(
    () => makeData(stats, populateDataFn, extraData),
    [stats, extraData, populateDataFn]
  )

  return (
    <Styles>
      <Table columns={columns} data={data} loading={loading} />
      {!!error && (
        <Box mt={3} width="100%">
          <Alert severity="error" >
            <Typography>{error}</Typography>
          </Alert>
        </Box>
      )}
    </Styles>
  )
}

export { SortableTable }
