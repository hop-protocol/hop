import React from 'react'
import Typography from '@material-ui/core/Typography'
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
} from 'src/utils/constants'
import { Flex, SvgImg } from '../ui'
import { StyledLink } from '../ui/StyledLink'

const iconLinks = [
  { url: discordUrl, image: discord },
  { url: twitterUrl, image: twitter },
  { url: githubUrl, image: github },
  { url: mediumUrl, image: medium },
]

const Footer = () => {
  return (
    <Flex
      fullWidth
      px={3}
      my={3}
      mt={5}
      height={'8rem'}
      alignCenter
      justifyContent={['flex-end', 'space-between']}
      $wrap
    >
      <Flex alignCenter mx={[3, 5]}>
        {iconLinks.map((il, i) => (
          <StyledLink
            key={il.url}
            href={il.url}
            mr={i === iconLinks.length - 1 ? 0 : '1rem'}
            opacity={0.2}
          >
            <SvgImg color="#E3DDF1" component={il.image} />
          </StyledLink>
        ))}
      </Flex>

      <Flex alignCenter mx={[3, 5]}>
        <StyledLink href={faqUrl} ml={[0, '1.6rem']}>
          <Typography variant="subtitle2">FAQ</Typography>
        </StyledLink>
        <StyledLink href={docsUrl} ml={['1.6rem']}>
          <Typography variant="subtitle2">Docs</Typography>
        </StyledLink>
        <StyledLink href={careersUrl} ml={['1.6rem']}>
          <Typography variant="subtitle2">Careers</Typography>
        </StyledLink>
      </Flex>
    </Flex>
  )
}

export default Footer
