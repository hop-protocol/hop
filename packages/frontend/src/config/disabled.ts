import logger from 'src/logger'
import { CanonicalToken, ChainSlug, Slug } from '@hop-protocol/sdk'
import { capitalize } from 'src/utils/capitalize'
import { discordUrl } from 'src/utils'

const emptyRoute = {
  message: {
    text: '',
    href: '',
    linkText: '',
    postText: '',
    severity: ''
  },
  source: '',
  destination: '',
  tokenSymbol: '',
  warningOnly: false,
}

export const ALL = 'all'

export interface DisabledRoute {
  source: ChainSlug | 'all'
  destination: ChainSlug | 'all'
  tokenSymbol: CanonicalToken
  message: any
  warningOnly: boolean
}

function formatDirection(source: any, destination: any) {
  let direction: string | undefined
  if (source === ALL) {
    direction = `to ${capitalize(destination)}`
  } else if (destination === ALL) {
    direction = `from ${capitalize(source)}`
  } else {
    direction = `from ${capitalize(source)} to ${capitalize(destination)}`
  }
  return direction
}

const validChainSlugs = new Set([...Object.values(Slug), ALL])
const validTokenSymbols = new Set(Object.values(CanonicalToken))

export function parseDisabledRoutes(
  serializedDisabledRoutes: string,
  serializedWarningRoutes: string,
  disabledRoutesNoLiquidityWarningMessage: boolean
): DisabledRoute[] {
  const disabledRoutes = serializedDisabledRoutes?.split(',').map(x => x?.trim())
  const warningRoutes = serializedWarningRoutes?.split(',').map(x => x?.trim())

  if (!disabledRoutes[0] || disabledRoutes[0] === 'false') return []

  if (disabledRoutes[0] !== '') {
    return (disabledRoutes as string[]).map((disabledRoute: string, i: number) => {
      const [source, destination, tokenSymbol] = disabledRoute.split(':')

      if (
        !(
          validChainSlugs.has(source?.toLowerCase()) &&
          validChainSlugs.has(destination?.toLowerCase())
        )
      ) {
        logger.error(`TYPO: Invalid source (${source}) or destination (${destination}).`)
        return emptyRoute
      }

      if (tokenSymbol) {
        if (!validTokenSymbols.has(tokenSymbol as CanonicalToken)) {
          logger.error(`TYPO: Invalid token "${tokenSymbol}", source: ${source}, destination: ${destination}`)
          return emptyRoute
        }
      }

      const direction = formatDirection(source, destination)

      const message = {
        text: `Transfers ${direction} are temporarily disabled. Please, check the #status channel in the Hop`,
        href: discordUrl,
        linkText: 'Discord',
        postText: 'for updates and more information.',
        severity: 'warning'
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
        message.severity = 'warning'
      }

      if (disabledRoutesNoLiquidityWarningMessage) {
        const text = `Insufficient liquidity. There is 0 bonder liquidity available on ${destination}. Please try again in a few minutes when liquidity becomes available again.`
        message.text = text
        message.href = ''
        message.linkText = ''
        message.postText = ''
        message.severity = 'warning'
      }

      return {
        message,
        source: source as any,
        destination: destination as any,
        tokenSymbol: tokenSymbol as any,
        warningOnly,
      }
    })
  }
  return []
}

// ex: all:polygon,all:arbitrum,gnosis:ethereum
const serializedDisabledRoutes = process.env.REACT_APP_DISABLED_ROUTES || ''
const serializedWarningRoutes = process.env.REACT_APP_WARNING_ROUTES || ''
const disabledRoutesNoLiquidityWarningMessage = !!(process.env.REACT_APP_DISABLED_ROUTES_NO_LIQUIDITY_WARNING_MESSAGE || '')
// ex: '0,Warning: transfers to exchanges that do not support internal transactions may result in lost funds.,false'

const disabledRoutes = parseDisabledRoutes(serializedDisabledRoutes, serializedWarningRoutes, disabledRoutesNoLiquidityWarningMessage)

export { disabledRoutes }
