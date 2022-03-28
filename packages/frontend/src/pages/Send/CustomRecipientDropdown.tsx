import React from 'react'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import LargeTextField from 'src/components/LargeTextField'

function CustomRecipientDropdown(props) {
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
