import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy } from 'src/utils'
import { IconStat } from './components/IconStat'
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'
import { getTokenImage } from 'src/utils/tokens'
import { Div, Flex } from 'src/components/ui'
import { GridContainer } from 'src/components/Grid'

const TopRow = styled(GridContainer)`
  grid-template-columns: 0.5fr 1.5fr 1.5fr 1fr;
  gap: 3px;
  justify-items: center;
`

const GridCells = styled(TopRow)`
  border-top: 1px solid #ababab;
  &:hover {
    background-color: ${({ theme }) => theme.colors.action.hover};
  }
`

const BalanceStats: FC = () => {
  const { balances, fetchingBalances } = useStats()

  return (
    <Div fontSize={[0, 0, 1]}>
      <TopRow gridGap={['1px', '10px']} p={2}>
        <Div bold>Chain</Div>
        <Div bold>Name</Div>
        <Div bold>Address</Div>
        <Div bold mb={1}>
          Balance
        </Div>
      </TopRow>
      {fetchingBalances ? (
        <Div>Loading...</Div>
      ) : (
        balances?.map(item => {
          return (
            <GridCells gridGap={['1px', '10px']} px={[3, 2]} py={[1, 2]}>
              <Flex alignCenter>
                <IconStat src={item.network.imageUrl} data={''} />
              </Flex>
              <Flex alignCenter justifySelf={'center'}>
                {item.name}
              </Flex>
              <Flex alignCenter>
                <CopyEthAddress value={item.address} />
              </Flex>
              <Flex alignCenter>
                <IconStat src={getTokenImage('ETH')} data={commafy(item.balance)} />
              </Flex>
            </GridCells>
          )
        })
      )}
    </Div>
  )
}

export default BalanceStats
