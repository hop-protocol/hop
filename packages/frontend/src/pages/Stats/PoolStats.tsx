import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { Div, Flex, Icon } from 'src/components/ui'
import SpacedTokenAmount from './components/SpacedTokenAmount'
import { GridContainer } from 'src/components/Grid'

function formatRatio(item) {
  const { reserve0, reserve1 } = item
  const div = reserve0 / reserve1
  return `${div.toString().slice(0, 6)}`
}

const TopRow = styled(GridContainer)`
  grid-template-columns: 0.5fr 2.7fr 2.7fr 1.5fr;
  gap: 5px;
  justify-items: end;
  justify-content: space-evenly;
  text-align: right;
`

const GridCells = styled(TopRow)`
  border-top: 1px solid #ababab;
  &:hover {
    background-color: ${({ theme }) => theme.colors.action.hover};
  }
`

const PoolStats: FC = () => {
  const { stats, fetching } = useStats()

  return (
    <Div fontSize={[0, 0, 1]}>
      <TopRow gridGap={['1px', '10px']} p={[1, 2]}>
        <Div bold>Chain</Div>
        <Div bold justifySelf="center">
          Token
        </Div>
        <Div bold justifySelf="center">
          H Token
        </Div>
        <Div bold justifySelf="right" mb={1}>
          Ratio
        </Div>
      </TopRow>

      {fetching ? (
        <Div>Loading...</Div>
      ) : (
        stats?.map(item => (
          <GridCells gridGap={['1px', '10px']} p={[1, 2]}>
            <Flex alignCenter justifySelf="center">
              <Icon src={item.network.imageUrl} width={[12, 24]} />
            </Flex>
            <Flex alignCenter>
              <SpacedTokenAmount symbol={item.token0.symbol} amount={item.reserve0} />
            </Flex>
            <Flex alignCenter>
              <SpacedTokenAmount symbol={item.token1.symbol} amount={item.reserve1} />
            </Flex>

            <Flex alignCenter>
              <Icon mr={1} src={item.token0.imageUrl} width={[12, 24]} />
              <Div justifySelf="right">{formatRatio(item)}</Div>
            </Flex>
          </GridCells>
        ))
      )}
    </Div>
  )
}

export default PoolStats
