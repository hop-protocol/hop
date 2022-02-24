import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy, composedStyleFns, ComposedStyleProps } from 'src/utils'
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'
import { IconStat } from './components'
import { Loading } from 'src/components/Loading'
import { Div } from 'src/components/ui'

export const GridContainer = styled.div<ComposedStyleProps>`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  @media (max-width: 600px) {
    grid-template-columns: repeat(7, 1fr);
  }
  justify-items: end;
  text-align: center;
  ${composedStyleFns}
`
const BonderStats: FC = () => {
  const { bonderStats, fetchingBonderStats } = useStats()

  return (
    <Div fontSize={['9px', 0, 1]} minWidth="300px" backgroundColor="white" p={3}>
      <GridContainer gridGap={['3px', '10px']}>
        <Div bold justifySelf={'center'}>
          Bridge
        </Div>
        <Div bold display={['none', 'block']} justifySelf={'center'}>
          Bonder
        </Div>
        <Div bold justifySelf={'center'}>
          Credit
        </Div>
        <Div bold justifySelf={'center'}>
          Debit
        </Div>
        <Div bold>Available Liquidity</Div>
        <Div bold>Pending Amount</Div>
        <Div bold>Total Amount</Div>
        <Div bold mb={1}>
          Available ETH
        </Div>
        {fetchingBonderStats ? (
          <Loading />
        ) : (
          bonderStats?.map(item => {
            return (
              <>
                <Div justifySelf={'center'}>
                  <IconStat src={item.network.imageUrl} data={item.token.symbol} width={[9, 18]} />
                </Div>
                <Div display={['none', 'block']}>
                  <CopyEthAddress value={item.bonder} />
                </Div>
                <Div>{commafy(item.credit)}</Div>
                <Div>{commafy(item.debit)}</Div>
                <Div>{commafy(item.availableLiquidity)}</Div>
                <Div>{commafy(item.pendingAmount)}</Div>
                <Div>{commafy(item.totalAmount)}</Div>
                <Div>{commafy(item.availableEth)}</Div>
              </>
            )
          })
        )}
      </GridContainer>
    </Div>
  )
}

export default BonderStats
