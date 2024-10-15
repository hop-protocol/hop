import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button } from '#components/Button/index.js'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'  // Import MUI Alert
import { useTokenList } from './useTokenList'

export const CustomTokenListManager = () => {
  const {
    customTokenListUrl,
    fetchTokenListFromUrl,
    deleteCustomTokenList,
    error, // Access error state from hook
  } = useTokenList()

  const [inputUrl, setInputUrl] = useState(customTokenListUrl || '') // Initialize with custom URL if exists
  const [status, setStatus] = useState<string | null>(null)          // To show status messages

  // Handler for saving custom token list URL
  const handleSave = async () => {
    setStatus(null) // Clear status
    if (inputUrl) {
      await fetchTokenListFromUrl(inputUrl)
      if (!error) {
        setStatus('Custom token list loaded successfully.') // Only show success if no error
      }
    }
  }

  // Handler for deleting custom token list
  const handleDelete = () => {
    deleteCustomTokenList()
    setInputUrl('')  // Clear input field
    setStatus('Custom token list deleted. Default list restored.')
  }

  return (
    <Box p={3} sx={{ maxWidth: '500px', margin: '0 auto' }}>
      {/* Input for custom token list URL */}
      <TextField
        fullWidth
        label="Custom Token List URL"
        placeholder="Enter custom token list URL"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          sx: {
            padding: '1.5rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '24px',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          },
        }}
      />

      {/* Save Button */}
      <Box mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!inputUrl}
          sx={{ mr: 2 }}
        >
          Save Token List
        </Button>
      </Box>

      {/* Display error message if it exists */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Status Message */}
      {status && !error && (
        <Typography
          variant="body2"
          color="green"
          sx={{ mt: 2 }}
        >
          {status}
        </Typography>
      )}

      {/* Show current custom token list URL */}
      {customTokenListUrl && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Current custom token list URL:
            <Box sx={{ maxWidth: '300px', overflow: 'auto' }}>{customTokenListUrl}</Box>
        </Typography>
      )}

      {/* Delete Button */}
      <Box mt={4}>
        <Button
          variant="text"
          color="secondary"
          onClick={handleDelete}
          sx={{
            fontSize: '1.2rem',
            fontWeight: 'normal'
          }}
          disabled={!customTokenListUrl}  // Disable if no custom token list is set
        >
          Delete Custom Token List
        </Button>
      </Box>
    </Box>
  )
}
