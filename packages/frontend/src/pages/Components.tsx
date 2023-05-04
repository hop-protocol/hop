import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Button from 'src/components/buttons/Button'
import LargeTextField from 'src/components/LargeTextField'
import SendIcon from '@material-ui/icons/Send'
import RaisedSelect from 'src/components/selects/RaisedSelect'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles(() => ({
  container: {
    maxWidth: '960px',
  },
  section: {
    margin: '20px',
  },
  sectionTitle: {
    marginBottom: '28px',
  },
  largeButton: {
    marginBottom: '28px',
  },
}))

type SectionProps = {
  title: string
}

const Section: FC<SectionProps> = ({ title, children }) => {
  const styles = useStyles()

  return (
    <Card className={styles.section}>
      <Typography variant="h4" className={styles.sectionTitle}>
        {title}
      </Typography>
      {children}
    </Card>
  )
}

const Components: FC = () => {
  const styles = useStyles()

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <div className={styles.container}>
        <Section title="Text Fields">
          <LargeTextField placeholder="Text Field" />
        </Section>

        <Section title="Cards">
          <Typography variant="h6">You're looking at one</Typography>
          <Typography variant="body1">
            This is a card. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
            irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </Typography>
        </Section>

        <Section title="Buttons">
          <Button className={styles.largeButton} startIcon={<SendIcon />}>
            Button
          </Button>
          <Button className={styles.largeButton} startIcon={<SendIcon />} flat>
            Button flat
          </Button>
          <Button className={styles.largeButton} startIcon={<SendIcon />} highlighted>
            Button highlighted
          </Button>
          <Button className={styles.largeButton} startIcon={<SendIcon />} disabled>
            Button disabled
          </Button>
          <Button className={styles.largeButton} startIcon={<SendIcon />} large>
            Button large
          </Button>
          <Button className={styles.largeButton} startIcon={<SendIcon />} large highlighted>
            Button large highlighted
          </Button>
          <Button className={styles.largeButton} startIcon={<SendIcon />} large disabled>
            Button large disabled
          </Button>
        </Section>

        <Section title="Selects">
          <RaisedSelect value="ETH">
            <MenuItem value="ETH">ETH</MenuItem>
            <MenuItem value="DAI">DAI</MenuItem>
          </RaisedSelect>
        </Section>

        <Section title="Typography">
          <Typography variant="h1">h1. Lorem ipsum</Typography>
          <Typography variant="h2">h2. Lorem ipsum dolor sit amet</Typography>
          <Typography variant="h3">h3. Lorem ipsum dolor sit amet</Typography>
          <Typography variant="h4">h4. Lorem ipsum dolor sit amet</Typography>
          <Typography variant="h5">h5. Lorem ipsum dolor sit amet</Typography>
          <Typography variant="h6">h6. Lorem ipsum dolor sit amet</Typography>
          <Typography variant="subtitle1">
            subtitle1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          </Typography>
          <Typography variant="subtitle2">
            subtitle2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          </Typography>
          <Typography variant="body1">
            body1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Typography>
          <Typography variant="body2">
            body2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Typography>
        </Section>
      </div>
    </Box>
  )
}

export default Components
