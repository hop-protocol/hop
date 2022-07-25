import { discordUrl } from 'src/utils'
import { parseDisabledRoutes } from './disabled'

describe('parseDisabledRoutes', () => {
  it('should split the env var correctly and return disabled route objects', () => {
    const disabledRoutes = 'all:polygon,all:arbitrum,gnosis:arbitrum'
    const warningRoutes =
      'false,Warning: transfers to exchanges that do not support internal transactions may result in lost funds.,false'
    const actual = parseDisabledRoutes(disabledRoutes, warningRoutes)

    const expected = [
      {
        source: 'all',
        destination: 'polygon',
        message: {
          text: `Warning: transfers to Polygon are temporarily disabled. Please, check the #status channel in the Hop`,
          href: discordUrl,
          linkText: 'Discord',
          postText: 'for updates and more information.',
        },
        warningOnly: false,
      },
      {
        source: 'all',
        destination: 'arbitrum',
        message: {
          text: `Warning: transfers to exchanges that do not support internal transactions may result in lost funds.`,
          href: '',
          linkText: '',
          postText: '',
        },
        warningOnly: true,
      },
      {
        source: 'gnosis',
        destination: 'arbitrum',
        message: {
          text: `Warning: transfers from Gnosis to Arbitrum are temporarily disabled. Please, check the #status channel in the Hop`,
          href: discordUrl,
          linkText: 'Discord',
          postText: 'for updates and more information.',
        },
        warningOnly: false,
      },
    ]
    expect(actual).toEqual(expected)
  })
})
