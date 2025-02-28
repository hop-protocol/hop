import Card from '@mui/material/Card'
import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { InfoTooltip } from '#components/InfoTooltip/index.js'
import { LargeTextField } from '#components/LargeTextField/index.js'

function CustomRecipientDropdown(props: any) {
  const { styles, customRecipient, handleCustomRecipientInput, isOpen = false, leftSideContent = null } = props

  return (
    <details className={styles.detailsDropdown} open={isOpen}>
      <summary style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }} className={styles.detailsDropdownSummary}>
        <Box display="flex" alignItems="center">
          {leftSideContent}
        </Box>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          component="div"
          className={styles.detailsDropdownLabel}
        >
          <span>Options</span>
        </Typography>
      </summary>

      <Card className={styles.customRecipient}>
        <Typography variant="body1" className={styles.customRecipientLabel}>
          Custom recipient
          <InfoTooltip title={`Set a different address to receive the funds at the destination. Make sure the recipient is able to receive to receive funds at the destination chain. If it's an exchange address, make sure the exchange supports internal transactions otherwise it may result in loss of funds.`} />
        </Typography>
        <LargeTextField
          leftAlign
          fullWidth
          value={customRecipient}
          onChange={handleCustomRecipientInput}
          placeholder="Enter address (e.g. 0x123...)"
          smallFontSize
        />
      </Card>
    </details>
  )
}

export default CustomRecipientDropdown
