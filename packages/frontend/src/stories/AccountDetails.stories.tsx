import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AccountDetails from 'src/components/accountDetails'
import TxPill from 'src/components/header/TxPill'
import { Flex } from 'src/components/ui'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Button from 'src/components/buttons/Button'

export default {
  title: 'components/AccountDetails',
  component: AccountDetails,
} as ComponentMeta<typeof AccountDetails>

const Template: ComponentStory<typeof AccountDetails> = args => {
  const { address, requestWallet } = useWeb3Context()

  return (
    <Flex>
      {address ? (
        <TxPill />
      ) : (
        <Button highlighted onClick={requestWallet}>
          Connect a Wallet
        </Button>
      )}

      <AccountDetails />
    </Flex>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
