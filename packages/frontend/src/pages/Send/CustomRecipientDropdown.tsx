import Card from '@mui/material/Card'
import React from 'react'
import Typography from '@mui/material/Typography'
import { InfoTooltip } from 'src/components/InfoTooltip'
import { LargeTextField } from 'src/components/LargeTextField'

function CustomRecipientDropdown(props: any) {
  const { styles, customRecipient, handleCustomRecipientInput, isOpen = false } = props

  return (
    <details className={styles.detailsDropdown} open={isOpen}>
      <summary className={styles.detailsDropdownSummary}>
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
