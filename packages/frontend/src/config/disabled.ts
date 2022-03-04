import { ChainSlug, Slug } from '@hop-protocol/sdk'
import capitalize from 'lodash/capitalize'
import logger from 'src/logger'
import { discordUrl } from 'src/utils'

const emptyRoute = {
  message: {
    text: '',
    href: '',
    linkText: '',
    postText: '',
  },
  source: '',
  destination: '',
  warningOnly: false,
}

export const ALL = 'all'

export interface DisabledRoute {
  source: ChainSlug | 'all'
  destination: ChainSlug | 'all'
  message: any
  warningOnly: boolean
}

function formatDirection(source, destination) {
  let direction: string | undefined
  if (source === ALL) {
    direction = `to ${capitalize(destination)}`
  } else if (destination === ALL) {
    direction = `from ${capitalize(destination)}`
  } else {
    direction = `from ${capitalize(source)} to ${capitalize(destination)}`
  }
  return direction
}

export function parseDisabledRoutes(
  serializedDisabledRoutes: string,
  serializedWarningRoutes: string
): DisabledRoute[] {
  const disabledRoutes = serializedDisabledRoutes?.split(',')
  const warningRoutes = serializedWarningRoutes?.split(',')

  if (disabledRoutes[0] !== '') {
    return (disabledRoutes as any[]).map((disabledRoute, i) => {
      const indexOfColon = disabledRoute.indexOf(':')
      const source = disabledRoute.slice(0, indexOfColon)
      const destination = disabledRoute.slice(indexOfColon + 1)

      if (!(source in Slug || source === ALL) || !(destination in Slug || destination === ALL)) {
        logger.error(`TYPO: Invalid source (${source}) or destination (${destination}).`)
        return emptyRoute
      }

      const direction = formatDirection(source, destination)

      const message = {
        text: `Warning: transfers ${direction} are temporarily disabled. Please, check the #status channel in the Hop`,
        href: discordUrl,
        linkText: 'Discord',
        postText: 'for updates and more information.',
      }

      // Defaults to disabling the Send button. If REACT_APP_WARNING_ROUTES contains a string,
      // that string will be displayed as the message, and the transaction can proceed.
      let warningOnly = false
      if (warningRoutes[i] && warningRoutes[i] !== '0' && warningRoutes[i] !== 'false') {
        warningOnly = true
        message.text = warningRoutes[i]
        message.href = ''
        message.linkText = ''
        message.postText = ''
      }

      return {
        message,
        source,
        destination,
        warningOnly,
      }
    })
  }
  return []
}

// ex: all:polygon,all:arbitrum,gnosis:ethereum
const serializedDisabledRoutes = process.env.REACT_APP_DISABLED_ROUTES || ''
const serializedWarningRoutes = process.env.REACT_APP_WARNING_ROUTES || ''
// ex: '0,Warning: transfers to exchanges that do not support internal transactions may result in lost funds.,false'

const disabledRoutes = parseDisabledRoutes(serializedDisabledRoutes, serializedWarningRoutes)

export { disabledRoutes }
