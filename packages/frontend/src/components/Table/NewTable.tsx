import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

export type Props = {
  stats?: any
  columns?: any
  header?: string
  loading?: boolean
  height?: string
  error?: any
}

export function NewTable (props: Props) {
  const _rows = props.stats
  const _columns = props.columns
  const header = _columns?.[0].Header
  const loading = props.loading

  const columns1: GridColDef[] = _columns?.[0].columns?.map((x: any) => {
    return {
      width: x.width,
      field: x.accessor,
      headerName: x.Header,
      renderCell: (cellValues: any) => {
        return x.Cell({ cell: { value: cellValues.value, row: cellValues.row.row } })
      }
    }
  }) ?? []
  const rows1 = _rows?.map((x: any, i: number) => {
    const data = columns1.reduce((acc: any, y: any) => {
      acc[y.field] = x[y.field]
      return acc
    }, {
      id: i,
      row: {
        original: x
      }
    })

    return data
  })

  return (
    <Box>
      <Typography variant="h6">{header}</Typography>
      <Box sx={{ height: props.height ?? '500px', width: '100%' }}>
        <DataGrid
          rows={rows1}
          rowHeight={30}
          columns={columns1}
          pageSize={100}
          style={{ height: '100%', width: '100%' }}
          loading={loading}
        />
      </Box>
    </Box>
  )
}
