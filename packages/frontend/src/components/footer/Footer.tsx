import React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { gitRevision } from 'src/config/config'
import { ReactComponent as discord } from 'src/assets/logos/discord.svg'
import { ReactComponent as github } from 'src/assets/logos/github.svg'
import { ReactComponent as medium } from 'src/assets/logos/medium.svg'
import { ReactComponent as twitter } from 'src/assets/logos/twitter.svg'
import {
  careersUrl,
  docsUrl,
  faqUrl,
  discordUrl,
  githubUrl,
  mediumUrl,
  twitterUrl,
  forumUrl,
} from 'src/utils/constants'
import { Flex, SvgImg } from '../ui'
import { StyledLink } from '../ui/StyledLink'
import { useThemeMode } from 'src/theme/ThemeProvider'
import { useBlockNumber } from './useBlockNumber'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: any) => ({
  container: {
    '& > div': {
      [theme.breakpoints.down('xs')]: {
        marginBottom: '2rem'
      }
    },
    '& > div a': {
      [theme.breakpoints.down('xs')]: {
        marginLeft: '1rem'
      }
    },
    '& > div a:first-child': {
      [theme.breakpoints.down('xs')]: {
        marginLeft: '0'
      }
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  }
}))

const iconLinks = [
  { url: discordUrl, image: discord },
  { url: twitterUrl, image: twitter },
  { url: githubUrl, image: github },
  { url: mediumUrl, image: medium },
]

const Footer = () => {
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
      <Flex alignCenter mx={[5]} justifyAround width={['20%']}>
        {iconLinks.map((il, i) => (
          <StyledLink
            key={il.url}
            href={il.url}
            mr={i === iconLinks.length - 1 ? 0 : '1rem'}
            opacity={0.4}
          >
            <SvgImg color={isDarkMode ? '#E3DDF1' : 'black'} component={il.image} />
          </StyledLink>
        ))}
      </Flex>

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
              backgroundColor: 'rgb(118, 209, 145)',
              transition: 'background-color 250ms ease 0s'
            }}></Box>
            <a href={`https://etherscan.io/block/${blockNumber}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="secondary">
                {blockNumber}
              </Typography>
            </a>
          </Box>
        )}
        {!!gitRevision && (
          <Box title="Build git revision number">
            <a href={`https://github.com/hop-protocol/hop/releases/tag/${gitRevision}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="secondary" component="span">
              rev:{gitRevision}
              </Typography>
            </a>
          </Box>
        )}
      </Box>

      <Flex alignCenter mx={[5]} justifyAround width={['20%']}>
        <StyledLink href={faqUrl} ml={['1.6rem']} opacity={0.6}>
          <Typography variant="subtitle2">FAQ</Typography>
        </StyledLink>
        <StyledLink href={docsUrl} ml={['1.6rem']} opacity={0.6}>
          <Typography variant="subtitle2">Docs</Typography>
        </StyledLink>
        <StyledLink href={forumUrl} ml={['1.6rem']} opacity={0.6}>
          <Typography variant="subtitle2">Forum</Typography>
        </StyledLink>
        <StyledLink href={careersUrl} ml={['1.6rem']} opacity={0.6}>
          <Typography variant="subtitle2">Careers</Typography>
        </StyledLink>
      </Flex>
    </Box>
  )
}

export default Footer
