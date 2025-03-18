'use client'
import React, { memo, useEffect, useState } from 'react'
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow
} from '@mui/material'

export const DecodedBondDataTable = memo(function DecodedBondDataTable({ data }: any) {
  // Client-only rendering to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!data || !isClient) {
    return null
  }

  return (
    <Box>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {Object.entries(data).map(([key, value]) => {
              if (key === 'nextHops') return null
              return (
                <TableRow key={key}>
                  <TableCell 
                    sx={{ 
                      minWidth: '95px', 
                      width: '95px',
                      whiteSpace: 'nowrap' 
                    }}
                  >
                    <Typography variant="body2">{key}:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{value as string}</Typography>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer>
        <Table size="small">
          <TableBody>
            {data.nextHops.length > 0 ? (
              data.nextHops.map((hop: any, index: number) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography variant="body2">
                        nextHops [{index + 1}]
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {Object.entries(hop).map(([hopKey, hopValue]: any[]) => (
                    <TableRow key={hopKey}>
                      <TableCell 
                        sx={{ 
                          minWidth: '150px', 
                          width: '150px',
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        <Typography variant="body2">{hopKey}:</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{hopValue}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  sx={{ 
                    minWidth: '95px', 
                    width: '95px',
                    whiteSpace: 'nowrap' 
                  }}
                >
                  <Typography variant="body2">nextHops:</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2"><em>[]</em></Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
})
