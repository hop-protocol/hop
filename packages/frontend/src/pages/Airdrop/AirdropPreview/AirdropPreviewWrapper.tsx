import React from 'react'
import Box from '@material-ui/core/Box'
import { EthAddress, Flex } from 'src/components/ui'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useThemeMode } from 'src/theme/ThemeProvider'

export const respMaxWidths = [350, 624, 824]

export function AirdropPreviewWrapper({ children }) {
  const { isDarkMode } = useThemeMode()

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Flex
        display="flex" justifyContent="center" flexDirection="column"
        p={['18px 24px', '36px 46px']}
        mx={[0, 4]}
        maxWidth={respMaxWidths}
        borderRadius={30}
        boxShadow={isDarkMode ? 'innerDark' : 'innerLight'}
        mt={2}
      >
        {children}
      </Flex>
    </Box>
  )
}
