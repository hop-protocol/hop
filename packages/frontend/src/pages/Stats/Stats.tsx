import React, { FC } from 'react'
import styled from 'styled-components/macro'
import PoolStats from './PoolStats'
import BonderStats from './BonderStats'
import PendingAmountStats from './PendingAmountStats'
import BalanceStats from './BalanceStats'
import DebitWindowStats from './DebitWindowStats'
import { Flex, Grid } from 'src/components/ui'
// import BalanceStatsNew from './BalanceStatsNew'
import { useTable } from 'react-table'

const Container = styled(Grid)`
  grid-template-columns: 1fr;
  grid-template-rows: repeat(5, 1fr);

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(5, 1fr);
  }
`

function Title({ text, children }: any) {
  return (
    <Flex alignCenter mb={[1, 2]} fontSize={[2, 2, 3]} bold>
      {text || children}
    </Flex>
  )
}

function Group({ title, children }) {
  return (
    <Flex column alignCenter m={4}>
      <Title text={title} />
      {children}
    </Flex>
  )
}
const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }: any, ref) => {
  const defaultRef = React.useRef()
  const resolvedRef: any = ref || defaultRef

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return <input type="checkbox" ref={resolvedRef} {...rest} />
})

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    getToggleHideAllColumnsProps,
    state,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <>
      <div>
        <div>
          <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle All
        </div>
        {allColumns.map(column => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} /> {column.id}
            </label>
          </div>
        ))}
        <br />
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  )
}

const Stats: FC = () => {
  return (
    <Flex column alignCenter>
      {/* <Container fullWidth gap={10} justifyCenter> */}

      <Group title="Pool Stats">
        <PoolStats />
      </Group>

      <Group title="Native Token Balances">
        <BalanceStats />
        {/* <BalanceStatsNew /> */}
      </Group>

      <Group title="Debit Window Stats">
        <DebitWindowStats />
      </Group>

      <Group title="Bonder Stats">
        <BonderStats />
      </Group>

      <Group title="Pending Amount Stats">
        <PendingAmountStats />
      </Group>
      {/* </Container> */}
    </Flex>
  )
}

export default Stats
