/// <reference types="vite-plugin-svgr/client" />
import Box from '@mui/material/Box'
import React from 'react'
import Typography from '@mui/material/Typography'
import discord from 'src/assets/logos/discord.svg?react'
import github from 'src/assets/logos/github.svg?react'
import medium from 'src/assets/logos/medium.svg?react'
import twitter from 'src/assets/logos/twitter.svg?react'
import { StyledLink } from 'src/components/Link/StyledLink'
import { SvgImg } from 'src/components/ui/SvgImg'
import {
  careersUrl,
  discordUrl,
  docsUrl,
  faqUrl,
  forumUrl,
  githubUrl,
  mediumUrl,
  twitterUrl,
} from 'src/utils/constants'
import { gitRevision } from 'src/config/config'
import { makeStyles } from '@mui/styles'
import { useBlockNumber } from 'src/components/Footer/useBlockNumber'
import { useThemeMode } from 'src/theme/ThemeProvider'

const useStyles = makeStyles((theme: any) => ({
  container: {
    '& > div': {
      '@media (max-width: 720px)': {
        marginBottom: '2rem'
      }
    },
    '& > div a': {
      '@media (max-width: 720px)': {
        marginLeft: '1rem'
      }
    },
    '& > div a:first-child': {
      '@media (max-width: 720px)': {
        marginLeft: '0'
      }
    },
    '@media (max-width: 720px)': {
      flexDirection: 'column',
    }
  }
}))

const iconLinks = [
  { url: discordUrl, image: discord },
  { url: twitterUrl, image: twitter },
  { url: githubUrl, image: github },
  { url: mediumUrl, image: medium },
]

export const Footer = () => {
  const styles = useStyles()
  const { isDarkMode } = useThemeMode()
  const { blockNumber } = useBlockNumber()
  return (
    <Box
      px={3}
      my={3}
      mt={5}
      mb={4}
      display="flex"
      textAlign="center"
      alignItems="center"
      justifyContent="space-between"
      className={styles.container}
    >
      <Box display="flex" alignItems="center" mx={[5]} justifyContent="space-around" width={['20%']}>
        {iconLinks.map((il, i) => (
          <Box mr={'1.6rem'} key={il.url}>
            <StyledLink
              key={il.url}
              href={il.url}
              opacity={0.4}
            >
              <SvgImg color={isDarkMode ? '#E3DDF1' : 'black'} component={il.image} />
            </StyledLink>
          </Box>
        ))}
      </Box>

      <Box display="flex" alignItems="center" style={{ opacity: 0.5 }}>
        {!!blockNumber && (
          <Box display="flex" alignItems="center" mr={2} title="Latest Ethereum block number">
            <Box mr={0.5} style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              minHeight: '8px',
              minWidth: '8px',
              borderRadius: '50%',
              position: 'relative',
              backgroundColor: 'rgb(118, 209, 145)'
            }}></Box>
            <a href={`https://etherscan.io/block/${blockNumber}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              <Typography variant="body2" color="secondary">
                {blockNumber}
              </Typography>
            </a>
          </Box>
        )}
        {!!gitRevision && (
          <Box title="Build git revision number" display="flex">
            <a href={`https://github.com/hop-protocol/hop/releases/tag/${gitRevision}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              <Typography variant="body2" color="secondary" component="span">
              rev:{gitRevision}
              </Typography>
            </a>
          </Box>
        )}
      </Box>

      <Box display="flex" alignItems="center" mx={[5]} justifyContent="space-around" width={['20%']}>
        <Box ml={'1.6rem'}>
          <StyledLink href={faqUrl} opacity={0.6}>
            <Typography variant="subtitle2">FAQ</Typography>
          </StyledLink>
        </Box>
        <Box ml={'1.6rem'}>
          <StyledLink href={docsUrl} opacity={0.6}>
            <Typography variant="subtitle2">Docs</Typography>
          </StyledLink>
        </Box>
        <Box ml={'1.6rem'}>
          <StyledLink href={forumUrl} opacity={0.6}>
            <Typography variant="subtitle2">Forum</Typography>
          </StyledLink>
        </Box>
        <Box ml={'1.6rem'}>
          <StyledLink href={careersUrl} opacity={0.6}>
            <Typography variant="subtitle2">Careers</Typography>
          </StyledLink>
        </Box>
      </Box>
    </Box>
  )
}
