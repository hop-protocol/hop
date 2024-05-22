import Faucet from '#pages/Faucet/Faucet.js'
import FaucetContext from '#pages/Faucet/FaucetContext.js'
import React from 'react'

const fc = () => (
  <FaucetContext>
    <Faucet />
  </FaucetContext>
)
export default fc
