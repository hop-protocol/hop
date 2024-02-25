import path from 'path'
import { exec } from 'child_process'
import { workerProgram } from 'src/cli/worker'

async function cli (args: any, cwd: any = '.'): Promise<any> {
  return new Promise(resolve => {
    exec(`node ${path.resolve(__dirname, '../bin/relayer')} ${args.join(' ')}`,
      { cwd },
      (error: any, stdout: any, stderr: any) => {
        resolve({
          code: error?.code ?? 0,
          error,
          stdout,
          stderr
        })
      })
  })
}

describe('cli', () => {
  describe('worker', () => {
    it('should correctly parse options', async () => {
      workerProgram.parse([
        'node',
        './bin/relayer',
        'worker',
        '--dry',
        '--server',
        '--indexer-poll-seconds',
        '10',
        '--skip-main'
      ])

      const opts = workerProgram.opts()
      console.log('opts', opts)

      expect(opts.dry).toBe(true)
      expect(opts.server).toBe(true)
      expect(opts.indexerPollSeconds).toBe(10)
      expect(opts.exitBundlePollSeconds).toBe(20)
      expect(opts.exitBundleRetryDelaySeconds).toBe(60)
    })
    it.skip('should start without error', async () => {
      const result = await cli(['worker', '--server'])
      expect(result.code).toBe(0)
    }, 60 * 1000)
  })
})
