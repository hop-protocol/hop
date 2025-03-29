'use client'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { CopyToClipboardText } from '@/app/components/CopyToClipboardText'

export const DetailRow = ({ loading, label, value, link, imageUrl, skeletonWidth = 200, maxWidth }: any) => {
  // Client-only rendering to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return null
  }

  if (value && Array.isArray(value)) {
    value = <Box>
      <ul>
        {value.map((v: string, i: number) => {


          console.log('foo', v, i, link?.[i])
          return (
            <li key={i}>
              <Link href={link?.[i]} target="_blank" rel="noreferrer">
                {v}
              </Link>
            </li>
          )
        })}
      </ul>
    </Box>
  }
  
  return (
    <TableRow sx={{ 
      wordBreak: 'break-all',
      '& td:first-of-type': {
        '@media (max-width: 900px)': {
          borderBottom: 'none',
          paddingBottom: 0,
        },
      },
      '@media (max-width: 900px)': {
        display: 'flex !important',
        flexDirection: 'column',
      },
    }}>
      <TableCell 
        sx={{ 
          minWidth: '350px',
          whiteSpace: 'nowrap',
          '@media (max-width: 900px)': {
            width: '100%',
          },
        }}
      >
        {label ? `${label}:` : ''}
      </TableCell>
      <TableCell
        sx={{ 
          maxWidth: maxWidth || 'auto',
          wordBreak: 'break-all'
        }}
      >
        <Box display="flex" alignItems="center" sx={{ flexWrap: 'wrap' }}>
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt=""
              sx={{
                width: 20,
                height: 20,
                mr: 1
              }}
            />
          )}
          {loading ? (
            <Skeleton variant="rectangular" width={skeletonWidth} height={20} />
          ) : (
            (typeof value === 'object') ? (
              value
            ) :
            (link && value) ? (
              <CopyToClipboardText text={value}>
                <Link 
                  href={link} 
                  target="_blank" 
                  rel="noreferrer"
                  sx={{ wordBreak: 'break-all' }}
                >
                  {value}
                </Link>
              </CopyToClipboardText>
            ) : ((typeof value === 'string' || typeof value === 'number') && value?.toString().trim() != '') ? (
              <CopyToClipboardText text={value as string}>{value}</CopyToClipboardText>
            ) : (value ? value : '-')
          )}
        </Box>
      </TableCell>
    </TableRow>
  )
}
