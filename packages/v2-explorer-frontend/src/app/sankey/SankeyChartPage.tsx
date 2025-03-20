'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Divider, Grid, Alert, Link } from '@mui/material'
import { SankeyChart } from '../components/charts/SankeyChart'
import { useTheme } from '@mui/material/styles'
import InfoIcon from '@mui/icons-material/Info'

export function SankeyChartPage() {
  const theme = useTheme()
  const [isClient, setIsClient] = useState(false)
  
  // Set isClient to true after component mounts on client
  useEffect(() => {
    console.log("[SankeyChartPage] Component mounted")
    setIsClient(true)
    
    // Debug window and document objects
    console.log("[SankeyChartPage] Window object available:", typeof window !== 'undefined')
    console.log("[SankeyChartPage] Document object available:", typeof document !== 'undefined')
    
    // Log any global D3 instance
    if (typeof window !== 'undefined') {
      console.log("[SankeyChartPage] Global d3 object:", (window as any).d3 ? "Available" : "Not available")
    }
    
    return () => {
      console.log("[SankeyChartPage] Component unmounting")
    }
  }, [])
  
  console.log("[SankeyChartPage] Rendering component, isClient =", isClient)
  
  return (
    <Box width="100%">
      {/* Information Alert - Only render on client to prevent hydration mismatch */}
      {isClient && (
        <Alert 
          severity="info" 
          icon={<InfoIcon />}
          sx={{ 
            mb: 4, 
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%',
            }
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              About This Visualization
            </Typography>
            <Typography variant="body2">
              This Sankey diagram visualizes token transfers between different networks in the Hop Protocol. 
              The width of each flow represents the relative volume of transfers. Hover over the connections to see detailed information.
            </Typography>
            <Box mt={1}>
              <Typography variant="body2" component="span" sx={{ opacity: 0.75 }}>
                Note: Currently displaying mock data for demonstration purposes.
              </Typography>
            </Box>
          </Box>
        </Alert>
      )}
      
      {/* Placeholder for the Alert when on server */}
      {!isClient && (
        <Box sx={{ mb: 4, height: 145 }} />
      )}
      
      {/* Debug info - only shown on client */}
      {isClient && (
        <Box mb={2} p={2} sx={{ border: '1px dashed #ccc', borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' }}>
          <Typography variant="subtitle2" fontWeight="bold">Debug Info:</Typography>
          <Typography variant="body2">Client-side rendering: {isClient ? "Active" : "Inactive"}</Typography>
          <Typography variant="body2">D3 available: {typeof window !== 'undefined' && (window as any).d3 ? "Yes" : "No"}</Typography>
          <Typography variant="body2">Theme mode: {theme.palette.mode}</Typography>
          <Typography variant="body2">Current time: {new Date().toISOString()}</Typography>
        </Box>
      )}
      
      {/* Sankey Chart */}
      <SankeyChart 
        title="Cross-Chain Transfer Flows" 
        subtitle="Visualization of token movements across different networks"
      />
      
      {/* Additional Information Cards */}
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={theme.palette.mode === 'dark' ? 2 : 1}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              How to Read This Chart
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" paragraph>
              <strong>Nodes:</strong> Represent source chains (left), destination chains (right), and tokens.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Flows:</strong> Indicate token transfers between chains. The width corresponds to volume.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Colors:</strong> Different colors represent different chains and tokens.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Interaction:</strong> Hover over connections to see detailed transfer information.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={theme.palette.mode === 'dark' ? 2 : 1}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              About Hop Protocol
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" paragraph>
              Hop Protocol is a scalable rollup-to-rollup general token bridge that allows users to seamlessly transfer tokens between different scaling solutions and layer 1.
            </Typography>
            <Typography variant="body2" paragraph>
              The protocol supports fast transfers between networks including Ethereum, Arbitrum, Optimism, and Base, enabling a more connected and interoperable blockchain ecosystem.
            </Typography>
            <Box mt={2}>
              <Link 
                href="https://hop.exchange" 
                target="_blank" 
                rel="noopener noreferrer"
                underline="hover"
                color="primary"
              >
                Learn more about Hop Protocol →
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
} 