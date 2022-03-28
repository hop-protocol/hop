import React from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { Div, Flex, Icon } from 'src/components/ui'
import { RightAlignedValue, SortableTable } from 'src/components/Table'
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'

export const populateBonderStats = (item: any) => {
  return {
    chain: item.network.imageUrl,
    token: item.token.imageUrl,
    bonder: item.bonder,
    credit: item.credit,
    debit: item.debit,
    availableLiquidity: item.availableLiquidity,
    pendingAmount: item.pendingAmount,
    totalAmount: item.totalAmount,
    availableNative: item.availableNative,
    vaultBalance: item.vaultBalance,
  }
}

const Container: any = styled(Div)<any>`
  align-self: center;
  overflow-x: scroll;
`

function BonderStats() {
  const { bonderStats, fetchingBonderStats } = useStats()

  const columns = React.useMemo(
    () => [
      {
        Header: 'Bonder Stats',
        columns: [
          {
            Header: 'Chain',
            accessor: 'chain',
            Cell: ({ cell }) => {
              return (
                <Flex justifyCenter {...cell.getCellProps()}>
                  <Icon src={cell.value} />
                </Flex>
              )
            },
          },
          {
            Header: 'Token',
            accessor: 'token',
            Cell: ({ cell }) => {
              return (
                <Flex justifyCenter {...cell.getCellProps()}>
                  <Icon src={cell.value} />
                </Flex>
              )
            },
          },
          {
            Header: 'Bonder',
            accessor: 'bonder',
            Cell: ({ cell }) => {
              return (
                <Flex justifyCenter {...cell.getCellProps()}>
                  <CopyEthAddress value={cell.value} />
                </Flex>
              )
            },
          },
          {
            Header: 'Credit',
            accessor: 'credit',
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Debit',
            accessor: 'debit',
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Available Liquidity',
            accessor: 'availableLiquidity',
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Pending Amount',
            accessor: 'pendingAmount',
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Total Amount',
            accessor: 'totalAmount',
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Available Native',
            accessor: 'availableNative',
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
          {
            Header: 'Vault Balance',
            accessor: 'vaultBalance',
            Cell: ({ cell }) => <RightAlignedValue cell={cell} />,
          },
        ],
      },
    ],
    []
  )

  return (
    <Container fontSize={[0, 1, 2]}>
      <SortableTable
        stats={bonderStats}
        columns={columns}
        populateDataFn={populateBonderStats}
        loading={fetchingBonderStats}
      />
    </Container>
  )
}

export default BonderStats
