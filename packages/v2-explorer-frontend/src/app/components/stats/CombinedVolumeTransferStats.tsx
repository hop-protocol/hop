import React from 'react'
import { Box, Paper, useTheme, Stack, Divider } from '@mui/material'
import { TotalVolumeStats } from './TotalVolumeStats'
import { TotalTransfersStats } from './TotalTransfersStats'

export const CombinedVolumeTransferStats: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const theme = useTheme()

  return (
    <Paper 
      elevation={isDarkMode ? 3 : 2}
      sx={{ 
        height: '100%',
        background: isDarkMode 
          ? `linear-gradient(145deg, rgba(30, 40, 50, 0.8) 0%, rgba(25, 25, 35, 0.9) 100%)`
          : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.9) 100%)',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isDarkMode 
          ? '0 4px 20px rgba(0,0,0,0.25)' 
          : undefined,
      }}
    >
      <Stack 
        divider={
          <Divider 
            sx={{ 
              borderColor: theme.palette.divider,
              my: 1
            }} 
          />
        }
        sx={{ 
          height: '100%', 
          p: 3
        }}
      >
        <Box flex={1}>
          <TotalVolumeStats />
        </Box>
        <Box flex={1}>
          <TotalTransfersStats />
        </Box>
      </Stack>
    </Paper>
  )
} 