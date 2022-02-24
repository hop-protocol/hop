import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy, composedStyleFns, ComposedStyleProps } from 'src/utils'
import { IconStat } from './components/IconStat'
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'
import { getTokenImage } from 'src/utils/tokens'
import { Div, Flex } from 'src/components/ui'

export const GridContainer = styled.div<ComposedStyleProps>`
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1.5fr 1fr;
  gap: 5px;
  justify-items: center;
  ${composedStyleFns}
`

const BalanceStats: FC = () => {
  const { balances, fetchingBalances } = useStats()

  return (
    <Div fontSize={[0, 0, 1]} minWidth="400px" backgroundColor="white" p={3}>
      <GridContainer gridGap={['1px', '10px']}>
        <Div bold>Network</Div>
        <Div bold>Name</Div>
        <Div bold>Address</Div>
        <Div bold mb={1}>
          Balance
        </Div>
        {fetchingBalances ? (
          <Div>Loading...</Div>
        ) : (
          balances?.map(item => {
            return (
              <>
                <Flex alignCenter>
                  <IconStat src={item.network.imageUrl} data={item.network.slug} />
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
              </>
            )
          })
        )}
      </GridContainer>
    </Div>
  )
}

export default BalanceStats
