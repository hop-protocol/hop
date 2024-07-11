'use client'
import React, { useEffect } from 'react'
import { Metadata } from 'next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export const metadata: Metadata = {
  title: 'Error'
}

export default function ErrorPage ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="subtitle1" color="textPrimary">
          An error occured loading this page
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </Box>
  )
}
