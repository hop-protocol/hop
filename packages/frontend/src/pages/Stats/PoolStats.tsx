import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { composedStyleFns, ComposedStyleProps } from 'src/utils'
import { Div, Flex, Icon } from 'src/components/ui'
import SpacedTokenAmount from './components/SpacedTokenAmount'

function formatRatio(item) {
  const { reserve0, reserve1 } = item
  const div = reserve0 / reserve1
  return `${div.toString().slice(0, 6)}`
}

export const GridContainer = styled.div<ComposedStyleProps>`
  display: grid;
  grid-template-columns: 0.1fr 2.7fr 2.7fr 1.5fr;
  gap: 5px;
  justify-items: end;
  text-align: right;
  ${composedStyleFns}
`

const PoolStats: FC = () => {
  const { stats, fetching } = useStats()

  return (
    <Div fontSize={[0, 0, 1]} minWidth="400px" backgroundColor="white" p={3}>
      <GridContainer gridGap={['1px', '10px']}>
        <Div bold>Chain</Div>
        <Div bold justifySelf="center">
          Token
        </Div>
        <Div bold justifySelf="center">
          H Token
        </Div>
        <Div bold justifySelf="center" mb={1}>
          Ratio
        </Div>

        {fetching ? (
          <Div>Loading...</Div>
        ) : (
          stats?.map(item => {
            return (
              <>
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
                  <Div justifySelf="center">{formatRatio(item)}</Div>
                </Flex>
              </>
            )
          })
        )}
      </GridContainer>
    </Div>
  )
}

export default PoolStats
