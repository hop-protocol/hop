import { ContractStates } from './ContractStates'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

export const metadata: Metadata = {
  title: 'Gateways',
}

// Render skeleton rows for tables
const renderSkeletonRows = (count = 5) => {
  return Array(count).fill(0).map((_, index) => (
    <TableRow key={`skeleton-row-${index}`}>
      <TableCell style={{ width: '30%' }}>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width="80%" />
      </TableCell>
    </TableRow>
  ));
};

// Render a skeleton section with title and table
const renderSectionSkeleton = (title: string, rowCount = 5) => (
  <Box mb={2}>
    <Typography variant="h6" gutterBottom>
      <Skeleton variant="text" width={120} />
    </Typography>
    <TableContainer>
      <Table>
        <TableBody>
          {renderSkeletonRows(rowCount)}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

// Render a skeleton for an entire contract card
const renderContractSkeleton = (index: number) => (
  <Paper key={`skeleton-contract-${index}`} elevation={2} sx={{ mb: 4, p: 2 }}>
    <Box display="flex" alignItems="center" mb={2}>
      <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={120} height={32} />
    </Box>
    
    {renderSectionSkeleton("Rails Gateway", 5)}
    
    <Box ml={2} mb={2}>
      <Typography variant="subtitle1" gutterBottom>
        <Skeleton variant="text" width={80} />
      </Typography>
      {renderSectionSkeleton("Paths", 4)}
    </Box>
    
    {renderSectionSkeleton("Staking Registry", 7)}
  </Paper>
);

const LoadingSkeleton = () => (
  <Box width="100%" maxWidth="1200px" p={2}>
    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Skeleton variant="circular" width={35} height={35} sx={{ mr: 1 }} />
          <Typography variant="h4">
            <Skeleton variant="text" width={250} />
          </Typography>
        </Box>
        <Skeleton variant="text" width={350} height={24} />
      </Box>
      <Skeleton variant="text" width={200} />
    </Box>
    
    {/* Show 3 skeleton contracts */}
    {[1, 2, 3].map((index) => renderContractSkeleton(index))}
  </Box>
);

export default async function ContractStatesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ContractStates />
    </Suspense>
  )
}
