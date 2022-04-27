import React from 'react'
import { Div, EthAddress, Flex } from 'src/components/ui'
import { useAirdropPreview } from './useAirdropPreview'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useThemeMode } from 'src/theme/ThemeProvider'
import { CriteriaCircle } from './CriteriaCircle'

export const respMaxWidths = [350, 624, 824]

export function AirdropPreviewWrapper({ children }) {
  const { isDarkMode } = useThemeMode()

  return (
    <Flex justifyCenter>
      <Flex
        column
        fontWeight={600}
        p={['18px 24px', '36px 46px']}
        mx={[0, 4]}
        maxWidth={respMaxWidths}
        borderRadius={30}
        boxShadow={isDarkMode ? 'innerDark' : 'innerLight'}
        mt={2}
      >
        {children}
      </Flex>
    </Flex>
  )
}
