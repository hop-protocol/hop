import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy, toTokenDisplay } from 'src/utils'
import { IconStat } from './components/IconStat'
import { Div, Flex, Icon } from 'src/components/ui'
import SpacedTokenAmount from './components/SpacedTokenAmount'
import { GridContainer } from 'src/components/Grid'

export const TopRow = styled(GridContainer)`
  display: grid;
  grid-template-columns: 0.8fr 0.5fr 2fr 2fr;
  gap: 5px;
  justify-content: stretch;
`
const GridCells = styled(TopRow)`
  border-top: 1px solid #ababab;
  justify-items: end;
  &:hover {
    background-color: ${({ theme }) => theme.colors.action.hover};
  }
`
const PendingAmountStats: FC = () => {
  const { pendingAmounts, fetchingPendingAmounts } = useStats()

  return (
    <Div fontSize={[0, 0, 1]}>
      <TopRow gridGap={['1px', '10px']} p={2}>
        <Div bold>Source</Div>
        <Div bold>Destination</Div>
        <Div bold justifySelf={'end'}>
          Pending Amount
        </Div>
        <Div bold justifySelf={'end'} mb={1}>
          Available Liquidity
        </Div>
      </TopRow>

      {fetchingPendingAmounts ? (
        <Div>Loading</Div>
      ) : (
        pendingAmounts?.map(item => {
          return (
            <GridCells px={[3, 2]} py={[1, 2]}>
              <Div justifySelf="center">
                <IconStat src={item.sourceNetwork.imageUrl} data={''} />
              </Div>
              <Div justifySelf="center">
                <IconStat src={item.destinationNetwork.imageUrl} data={''} />
              </Div>

              <Flex alignCenter>
                <Icon mr={[1, 2]} src={item.token.imageUrl} width={[12, 24]} />
                {commafy(item.formattedPendingAmount)}
              </Flex>

              <Flex alignCenter>
                <SpacedTokenAmount
                  symbol={item.token.symbol}
                  amount={toTokenDisplay(item.availableLiquidity, item.token.decimals)}
                />
              </Flex>
            </GridCells>
          )
        })
      )}
    </Div>
  )
}

export default PendingAmountStats
