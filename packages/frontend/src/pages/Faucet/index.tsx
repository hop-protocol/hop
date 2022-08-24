import React from 'react'
import Faucet from './Faucet'
import FaucetContext from './FaucetContext'

const fc = () => (
  <FaucetContext>
    <Faucet />
  </FaucetContext>
)
export default fc
