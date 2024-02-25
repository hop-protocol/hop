import '../moduleAlias'
import { program } from './shared'

import './worker'

program.version(process.env.GIT_REV ?? '')
program.parse(process.argv)

process.on('SIGINT', () => {
  console.debug('received SIGINT signal. exiting.')
  process.exit(0)
})

process.on('unhandledRejection', (reason: Error, p: Promise<any>) => {
  console.error('unhandled rejection: promise:', p, 'reason:', reason)
})
