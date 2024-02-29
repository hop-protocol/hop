import { actionHandler, root } from './shared/index.js'

root
  .command('show-config')
  .description('Update config file')
  .action(actionHandler(main))

async function main (source: any) {
  const { config } = source
  console.log(JSON.stringify(config, null, 2))
}
