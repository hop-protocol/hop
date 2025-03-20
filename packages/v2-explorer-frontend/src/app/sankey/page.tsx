import { Metadata } from 'next'
import { Suspense } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SankeyChartPage } from './SankeyChartPage'
import { LoadingText } from '@/app/components/LoadingText'

export const metadata: Metadata = {
  title: 'Network Flow Visualization - Hop v2 Explorer',
  description: 'Visualize token transfers between different networks in the Hop Protocol'
}

export default function Page() {
  return (
    <Box width="100%" maxWidth="1400px" m="0 auto" p={2}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Transfer Visualization
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Explore token transfers between different networks in the Hop Protocol ecosystem
        </Typography>
      </Box>
      
      <Suspense fallback={<LoadingText />}>
        <SankeyChartPage />
      </Suspense>
    </Box>
  )
} 