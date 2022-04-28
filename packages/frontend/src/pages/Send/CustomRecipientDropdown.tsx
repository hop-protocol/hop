import React from 'react'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import LargeTextField from 'src/components/LargeTextField'

function CustomRecipientDropdown(props) {
  const { styles, customRecipient, setCustomRecipient, isOpen = false, setError } = props

  const handleChange = (event: any) => {
    setError(null)
    const value = event.target.value.trim()
    setCustomRecipient(value)
  }

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
          onChange={handleChange}
          placeholder="Enter address (e.g. 0x123...)"
          smallFontSize
        />
      </Card>
    </details>
  )
}

export default CustomRecipientDropdown
