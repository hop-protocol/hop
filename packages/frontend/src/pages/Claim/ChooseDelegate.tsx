import React from 'react'
import { Link } from 'src/components/Link'
import { Circle, Flex, Icon, Input } from 'src/components/ui'
import { useThemeMode } from 'src/theme/ThemeProvider'
import Button from 'src/components/buttons/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useDelegates } from './useDelegates'
import { Delegate } from './useClaim'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { DelegateIcon } from './DelegateIcon'
import ChatIcon from '@material-ui/icons/Chat'

const useStyles = makeStyles(() => ({
  box: {
    borderRadius: '10px',
    transition: 'background-color 0.25s ease',
    '&:hover': {
      backgroundColor: '#b7b7b721',
    }
  }
}))

export function ChooseDelegate(props: any) {
  const styles = useStyles()
  const { delegate, selectDelegate, onContinue, inputValue, setInputValue } = props
  const { delegates } = useDelegates()
  const { theme } = useThemeMode()

  function handleSelectDelegate(del: Delegate) {
    if (inputValue) {
      setInputValue('')
    }
    if (del?.address?.toString() === delegate?.address?.toString()) {
      return selectDelegate()
    }
    selectDelegate(del)
  }

  return (
    <Box>
      <Box my={3} textAlign="left">
        <Typography variant="body1">
          Select a community member to represent you.
          You can change this at any time.
        </Typography>
        <Box mt={1} textAlign="left">
          <Typography variant="body1">
            Click on the <Box mx={1} display="inline-flex"><ChatIcon style={{ color: theme.palette.secondary.main }} /></Box> icon to read their application.
          </Typography>
        </Box>
      </Box>

      <Box my={4} py={2} display="flex" flexWrap="wrap" justifyContent="space-around" style={{
          borderRadius: '6px'
        }}>
        {!delegates?.length && (
          <Box display="flex" justifyContent="center" alignItems="center" textAlign="center" p={6}>
            <CircularProgress size={24} />
            <Box ml={2}>
              <Typography variant="body1">
                Fetching delegates...
              </Typography>
            </Box>
          </Box>
        )}
        {delegates.map((del: Delegate, i) => {
          const isSelected = del?.address && delegate?.address?.toString() ! === del?.address?.toString()
          return (
            <Flex
              key={i}
              my={2}
              mx={1}
              bg={'background.contrast'}
              borderRadius={'10px'}
              boxShadow={'0px 4px 25px 10px rgba(255, 255, 255, 0.01)'}
              width={[300, 300]}
              maxWidth={[275, 325]}
              pointer
              style={isSelected ? {
                background: 'rgba(0, 0, 0, 0) linear-gradient(99.85deg, rgb(179, 46, 255) -18.29%, rgb(242, 164, 152) 109.86%) repeat scroll 0% 0%',
              } : {}}
            >
              <Box display="flex" justifyContent="space-between" alignContent="center" className={styles.box} width="100%"
                py={1}
                px={3}
              >
                <Box display="flex" alignItems="center" alignContent="center" width="100%" onClick={() => handleSelectDelegate(del)}>
                  <Box mr={1}>
                    <DelegateIcon delegate={del} />
                  </Box>
                  <Box p={2} display="flex" flexDirection="column" alignContent="flex-start" textAlign="left">
                    <Typography variant="subtitle2"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '155px',
                      width: '100%',
                      ...(isSelected ? {
                      color: '#fff'
                    } : {})
                    }}
                    >{del.ensName || del.address?.truncate()}</Typography>
                    <Typography title="Votes" variant="body1" color="secondary"
                    style={isSelected ? {
                      color: '#fff'
                    } : {}}
                    >{del.votes == null ? '...' : del.votesFormatted}</Typography>
                  </Box>
                </Box>
                <Box fontSize={20} display="flex" justifyContent="center" alignItems="center">
                  {!!del.infoUrl && (
                    <Link
                      underline="none"
                      target="_blank"
                      rel="noreferrer noopener"
                      href={del.infoUrl}
                      style={{
                        color: isSelected ? '#fff' : theme.palette.secondary.main
                      }}
                    >
                      <ChatIcon />
                    </Link>
                  )}
                </Box>
              </Box>
            </Flex>
          )
        })}
      </Box>
      <Box display="flex" flexDirection="column">
        <Box mb={4} fontSize={2} textAlign="center">
          <Typography variant="body1">
            You can delegate to someone not listed, or to yourself, by entering an ENS name or Ethereum
            address.
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignContent="center" width="100%">
          <Box display="flex" justifyContent="center" alignContent="center" width="100%">
            <Box ml={'-45px'} mr={2} width="45px">
              {inputValue && delegate && (
                <DelegateIcon delegate={delegate} />
              )}
            </Box>
            <Box display="flex" justifyContent="content" width="100%" maxWidth="480px">
              <Input
                width="100%"
                value={inputValue}
                placeholder="Enter ENS or address"
                onChange={e => setInputValue(e.target.value)}
                bg="background.default"
                boxShadow={theme.boxShadow.inner}
                color="text.secondary"
                fontSize={[0, 1, 2]}
                border={inputValue && `1px solid ${theme.palette.primary.main}`}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mt={4} display="flex" justifyContent="center" maxWidth>
        <Button large highlighted onClick={onContinue} disabled={!delegate?.address}>
          Continue to Review
        </Button>
      </Box>
    </Box>
  )
}
