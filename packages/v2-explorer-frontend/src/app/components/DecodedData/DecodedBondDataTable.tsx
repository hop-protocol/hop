import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableRow, Typography, Box } from '@mui/material'

export function DecodedBondDataTable({ data }: any) {
  if (!data) {
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
                  <TableCell style={{ minWidth: '95px' }}>
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
                      <TableCell style={{ minWidth: '150px' }}>
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
                <TableCell style={{ width: '95px' }}>
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
}
