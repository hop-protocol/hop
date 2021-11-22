import React from 'react'
import { utils } from 'ethers'
import { Div, Flex } from 'src/components/ui'
import { weiArgsToConvert } from 'src/utils'
import { Link } from '@material-ui/core'

export function DisplayObjectValues({ params, title, token }: any) {
  function convertWeiValues(key: string, value: string) {
    if (weiArgsToConvert.includes(key) && token) {
      return `${utils.formatUnits(value, token.decimals)} ${token.symbol}`
    }
    return value
  }

  return (
    <Div my={2}>
      <Div bold color="primary.main" my={2}>
        {title}
      </Div>

      {Object.keys(params).map(param => (
        <Flex key={param} justifyBetween mb={2}>
          <Div mr={4}>{param}:</Div>
          {param === 'transactionHash' ? (
            <Link href={`/tx/${params[param]}`}>{params[param]}</Link>
          ) : (
            <Div>{convertWeiValues(param, params[param])}</Div>
          )}
        </Flex>
      ))}
    </Div>
  )
}
