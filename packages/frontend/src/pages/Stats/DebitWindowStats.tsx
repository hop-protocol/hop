import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy } from 'src/utils'
import { IconStat } from './components/IconStat'
import { Div, Flex } from 'src/components/ui'
import { GridContainer } from 'src/components/Grid'
import { grid } from 'styled-system'

export const TopRow = styled(GridContainer)`
  grid-template-columns: 0.5fr repeat(6, 1.65fr) 1fr 2fr;
  justify-content: center;
  justify-items: center;
  text-align: center;
  & > div {
    min-width: 5px;
  }
  ${grid}
`

const GridCells = styled(TopRow)`
  border-top: 1px solid #ababab;
  text-align: center;
  &:hover {
    background-color: ${({ theme }) => theme.colors.action.hover};
  }
  ${grid}
`

const DebitWindowStats: FC = () => {
  const { debitWindowStats, bonderStats, fetchingDebitWindowStats } = useStats()

  return (
    <Div fontSize={['7px', 0, 1]}>
      <TopRow gridGap={['3px', '10px']} p={[1, 3]}>
        <Div bold>Token</Div>
        <Div bold>Slot-0</Div>
        <Div bold>Slot-1</Div>
        <Div bold>Slot-2</Div>
        <Div bold>Slot-3</Div>
        <Div bold>Slot-4</Div>
        <Div bold>Slot-5</Div>
        <Div bold>Minutes</Div>
        <Div bold justifySelf={'right'}>
          Virtual Debt
        </Div>
      </TopRow>

      {fetchingDebitWindowStats ? (
        <Div>Loading...</Div>
      ) : (
        debitWindowStats?.map((item, i) => (
          <GridCells gridGap={['3px', '10px']} p={[1, 3]}>
            <IconStat src={item.token.imageUrl} data={''} />
            <Flex alignCenter>{commafy(item.amountBonded[0])}</Flex>
            <Flex alignCenter>{commafy(item.amountBonded[1])}</Flex>
            <Flex alignCenter>{commafy(item.amountBonded[2])}</Flex>
            <Flex alignCenter>{commafy(item.amountBonded[3])}</Flex>
            <Flex alignCenter>{commafy(item.amountBonded[4])}</Flex>
            <Flex alignCenter>{commafy(item.amountBonded[5])}</Flex>
            <Flex alignCenter>{commafy(item.remainingMin)}</Flex>
            <Div justifySelf={'right'}>{commafy(bonderStats[i]?.virtualDebt)}</Div>
          </GridCells>
        ))
      )}
    </Div>
  )
}

export default DebitWindowStats
