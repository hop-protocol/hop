import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import discord from 'src/assets/logos/discord.svg';
import github from 'src/assets/logos/github.svg';
import medium from 'src/assets/logos/medium.svg';
import twitter from 'src/assets/logos/twitter.svg';
import {
  careersUrl,
  docsUrl,
  faqUrl,
  discordUrl,
  githubUrl,
  mediumUrl,
  twitterUrl
} from 'src/constants'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: `0 ${theme.padding.thick}`,
    height: '8.0rem',
    boxSizing: 'border-box'
  },
  link: {
    marginRight: '1.6rem',
    width: '2.5rem',
    opacity: 0.2,
    '&:hover': {
      opacity: 1.0
    }
  },
  footerLink: {
    marginLeft: '1.6rem',
    opacity: 0.4,
    color: theme.palette.text.secondary,
    '&:hover': {
      opacity: 1.0,
      color: theme.palette.primary.main
    }
  },
  footerLinkFocus: {
    opacity: 1.0,
    color: theme.palette.primary.main
  }
}))

type Props = {}

const Footer: FC<Props> = () => {
  const styles = useStyles()

  return (
    <Box
      className={styles.root}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Link
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={discord} className={styles.link} alt="logo" />
        </Link>
        <Link
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={twitter} className={styles.link} alt="logo" />
        </Link>
        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={github} className={styles.link} alt="logo" />
        </Link>
        <Link
          href={mediumUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={medium} className={styles.link} alt="logo" />
        </Link>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Link
          href={faqUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          <Typography variant="subtitle2">
            FAQ
          </Typography>
        </Link>
        <Link
          href={docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          <Typography variant="subtitle2">
            Docs
          </Typography>
        </Link>
        <Link
          href={careersUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          <Typography variant="subtitle2">
            Careers
          </Typography>
        </Link>
      </Box>
    </Box>
  )
}

export default Footer
