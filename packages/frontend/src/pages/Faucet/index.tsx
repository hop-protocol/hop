import React from 'react'
import Faucet from 'src/pages/Faucet/Faucet'
import FaucetContext from 'src/pages/Faucet/FaucetContext'

const fc = () => (
  <FaucetContext>
    <Faucet />
  </FaucetContext>
)
export default fc
