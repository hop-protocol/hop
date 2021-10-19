import React from 'react'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import LargeTextField from 'src/components/LargeTextField'

function CustomRecipientDropdown(props) {
  const { styles, customRecipient, handleCustomRecipientInput } = props

  return (
    <details className={styles.detailsDropdown}>
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
      <div>
        <div className={styles.customRecipient}>
          <Card>
            <Typography variant="body1" className={styles.customRecipientLabel}>
              Custom recipient
            </Typography>
            <LargeTextField
              style={{
                width: '100%',
              }}
              leftAlign
              value={customRecipient}
              onChange={handleCustomRecipientInput}
              placeholder="0x"
            />
          </Card>
        </div>
      </div>
    </details>
  )
}

export default CustomRecipientDropdown
