import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy, composedStyleFns, ComposedStyleProps, toTokenDisplay } from 'src/utils'
import { IconStat } from './components/IconStat'
import { Div, Flex, Icon } from 'src/components/ui'
import SpacedTokenAmount from './components/SpacedTokenAmount'
import { useWindowSize } from 'react-use'

export const GridContainer = styled.div<ComposedStyleProps>`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 3fr;
  gap: 5px;
  justify-items: center;
  ${composedStyleFns}
`
const PendingAmountStats: FC = () => {
  const { pendingAmounts, fetchingPendingAmounts } = useStats()
  const { width } = useWindowSize()

  return (
    <Div fontSize={[0, 0, 1]} minWidth="400px" backgroundColor="white" p={3}>
      <GridContainer gridGap={['1px', '10px']}>
        <Div bold>Src</Div>
        <Div bold>Dest</Div>
        <Div bold justifySelf={'end'}>
          Pending Amount
        </Div>
        <Div bold justifySelf={'end'} mb={1}>
          Available Liquidity
        </Div>

        {fetchingPendingAmounts ? (
          <Div>Loading</Div>
        ) : (
          pendingAmounts?.map(item => {
            return (
              <>
                <Div justifySelf={'center'}>
                  <IconStat
                    src={item.sourceNetwork.imageUrl}
                    data={width > 600 ? item.sourceNetwork.name : ''}
                  />
                </Div>

                <Div justifySelf={'center'}>
                  <IconStat
                    src={item.destinationNetwork.imageUrl}
                    data={width > 600 ? item.destinationNetwork.name : ''}
                  />
                </Div>

                <Flex alignCenter justifySelf={'end'}>
                  <Icon mr={[1, 2]} src={item.token.imageUrl} width={[12, 24]} />
                  {commafy(item.formattedPendingAmount)}
                </Flex>

                <Flex alignCenter justifySelf={'end'}>
                  <Icon mr={[1, 2]} src={item.token.imageUrl} width={[12, 24]} />
                  <SpacedTokenAmount
                    symbol={item.token.symbol}
                    amount={toTokenDisplay(item.availableLiquidity, item.token.decimals)}
                  />
                </Flex>
              </>
            )
          })
        )}
      </GridContainer>
    </Div>
  )
}

export default PendingAmountStats
