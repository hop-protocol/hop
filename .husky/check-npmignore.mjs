import { exec } from 'node:child_process'

/**
 * Disallow pushing .npmignore to the repository to prevent accidental publishing of secrets.
 * 
 * All published files should be included in the `files` object of package.json which
 * takes precedent over both files anyway, so this is just a safety measure.
 * 
 * Anything that should be ignored by npm should be added to .gitignore since
 * npm uses .gitignore to determine what to ignore when .npmignore is not present.
 * 
 * .npmignore docs: https://docs.npmjs.com/cli/v9/using-npm/developers#keeping-files-out-of-your-package
 * Explainer: https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d
 */

exec('git diff --cached --name-only', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`)
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    process.exit(1)
  }

  const stagedFiles = stdout.split('\n')
  for (const stagedFile of stagedFiles) {
    if (stagedFile.includes('.npmignore')) {
      console.error('You are trying to commit .npmignore. Please reconsider if this is necessary.')
      process.exit(1)
    }
  }
})
