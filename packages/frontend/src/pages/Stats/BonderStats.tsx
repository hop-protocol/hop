import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy } from 'src/utils'
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'
import { Loading } from 'src/components/Loading'
import { Div, Icon } from 'src/components/ui'
import { GridContainer } from 'src/components/Grid'

export const TopRow = styled(GridContainer)`
  grid-template-columns: 1fr 1fr repeat(6, 2.75fr) 2fr;
  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr repeat(5, 3fr) 2fr;
  }
  justify-items: center;
  text-align: center;
  gap: 3px;
`

const GridCells = styled(TopRow)`
  border-top: 1px solid #ababab;
  justify-items: end;
  &:hover {
    background-color: ${({ theme }) => theme.colors.action.hover};
  }
`
const BonderStats: FC = () => {
  const { bonderStats, fetchingBonderStats } = useStats()

  return (
    <Div fontSize={['8px', 0, 1]}>
      <TopRow gridGap={['1px', '10px']} p={[1, 2]}>
        <Div bold justifySelf={'center'}>
          Chain
        </Div>
        <Div bold justifySelf={'center'}>
          Token
        </Div>
        <Div bold justifySelf={'center'} display={['none', 'block']}>
          Bonder
        </Div>
        <Div bold>Credit</Div>
        <Div bold>Debit</Div>
        <Div bold>Available Liquidity</Div>
        <Div bold>Pending Amount</Div>
        <Div bold>Total Amount</Div>
        <Div bold mb={1} textAlign="right" justifySelf={'end'}>
          Available ETH
        </Div>
      </TopRow>

      {fetchingBonderStats ? (
        <Loading />
      ) : (
        bonderStats?.map(item => {
          return (
            <GridCells gridGap={['1px', '10px']} p={[1, 2]}>
              <Div justifySelf={'center'}>
                <Icon src={item.network.imageUrl} width={[9, 18]} />
              </Div>
              <Div justifySelf={'center'}>
                <Icon src={item.token.imageUrl} width={[9, 18]} />
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
            </GridCells>
          )
        })
      )}
    </Div>
  )
}

export default BonderStats
