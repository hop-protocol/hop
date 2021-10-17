import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Box } from '@material-ui/core'

export default {
  title: 'ui/Box',
  component: Box,
} as ComponentMeta<typeof Box>

const Template: ComponentStory<typeof Box> = args => <Box {...args}>Box</Box>

export const Basic = Template.bind({})
Basic.args = {
  border: '1px solid black',
}
