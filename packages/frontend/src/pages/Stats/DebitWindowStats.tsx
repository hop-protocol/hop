import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy, composedStyleFns, ComposedStyleProps } from 'src/utils'
import { IconStat } from './components/IconStat'
import { Div } from 'src/components/ui'

export const GridContainer = styled.div<ComposedStyleProps>`
  display: grid;
  grid-template-columns: 1fr repeat(6, 2fr) 1fr 2fr;
  justify-items: end;
  ${composedStyleFns}
`
const DebitWindowStats: FC = () => {
  const { debitWindowStats, bonderStats, fetchingDebitWindowStats } = useStats()

  return (
    <Div fontSize={['8px', 0, 1]} minWidth="300px" backgroundColor="white" p={3}>
      <GridContainer gridGap={['3px', '10px']}>
        <Div justifySelf="center" bold>
          Token
        </Div>
        <Div bold>Slot-0</Div>
        <Div bold>Slot-1</Div>
        <Div bold>Slot-2</Div>
        <Div bold>Slot-3</Div>
        <Div bold>Slot-4</Div>
        <Div bold>Slot-5</Div>
        <Div bold>Minutes</Div>
        <Div bold mb={1}>
          Virtual Debt
        </Div>
        {fetchingDebitWindowStats ? (
          <Div>Loading...</Div>
        ) : (
          debitWindowStats?.map((item, i) => (
            <>
              <Div>{item.token.symbol}</Div>
              <Div>{commafy(item.amountBonded[0])}</Div>
              <Div>{commafy(item.amountBonded[1])}</Div>
              <Div>{commafy(item.amountBonded[2])}</Div>
              <Div>{commafy(item.amountBonded[3])}</Div>
              <Div>{commafy(item.amountBonded[4])}</Div>
              <Div>{commafy(item.amountBonded[5])}</Div>
              <Div>{commafy(item.remainingMin)}</Div>
              <Div>
                <IconStat src={item.token.imageUrl} data={commafy(bonderStats[i]?.virtualDebt)} />
              </Div>
            </>
          ))
        )}
      </GridContainer>
    </Div>
  )
}

export default DebitWindowStats
