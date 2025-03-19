import React from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import LinearProgress from '@mui/material/LinearProgress';

export default function Loading() {
  return (
    <Box sx={{ width: '100%', maxWidth: '900px' }}>
      <Paper elevation={0} style={{ padding: 16, marginBottom: 16, background: 'transparent' }}>
        <Box sx={{ width: '400px' }}>
          <LinearProgress />
        </Box>
      </Paper>
    </Box>
  )
}
