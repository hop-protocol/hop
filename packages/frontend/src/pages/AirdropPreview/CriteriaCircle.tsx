import React from 'react'
import { CheckCircle, XCircle } from 'react-feather'
import { Div } from 'src/components/ui'

export function CriteriaCircle({ criteria, ...rest }) {
  return (
    <Div {...rest}>
      {criteria ? <CheckCircle size={24} color="green" /> : <span><em>not eligible</em></span>}
    </Div>
  )
}
