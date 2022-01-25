import React, { FC } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { useStats } from 'src/pages/Stats/StatsContext'
import { commafy } from 'src/utils'
import range from 'lodash/range'
import { IconStat } from './components/IconStat'
import { CopyEthAddress } from 'src/components/ui/CopyEthAddress'
import { getTokenImage } from 'src/utils/tokens'
import { Div, Flex, Grid } from 'src/components/ui'
import styled from 'styled-components'

const GridContainer = styled(Grid)`
  grid-template-rows: repeat(5, 1fr);
`

const BalanceStatsNew: FC = () => {
  const { balances, fetchingBalances } = useStats()

  return (
    <Div>
      <GridContainer>
        <Div>
          <th>Network</th>
          <th>Name</th>
          <th>Address</th>
          <th>ETH Balance</th>
        </Div>
        {fetchingBalances
          ? range(2).map((x, i) => {
              return (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <Skeleton animation="wave" width={'100%'} />
                  </TableCell>
                </TableRow>
              )
            })
          : balances?.map(item => {
              return (
                <Flex key={item.address} gridTemplateColumns="repeat(5, 1fr)">
                  <Div>
                    <IconStat src={item.network.imageUrl} data={item.network.slug} />
                  </Div>
                  <Div>
                    <IconStat src={item.tokenImageUrl} data={item.name} />
                  </Div>
                  <Div>
                    <CopyEthAddress value={item.address} />
                  </Div>
                  <Div>
                    <IconStat src={getTokenImage('ETH')} data={commafy(item.balance)} />
                  </Div>
                </Flex>
              )
            })}
      </GridContainer>
    </Div>
  )
}

export default BalanceStatsNew
