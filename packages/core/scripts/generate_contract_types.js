const fs = require('fs').promises
const path = require('path')

const sourceDir = 'src/abitype'
const outputDir = 'src/contracts'

const generateClassFile = (filename) => `
import { Contract, providers, Signer } from 'ethers'
import { Abi } from 'abitype'
import { getContract, GetContractResult as TypedContract } from '@wagmi/core'
import abi from './${filename}_abi'

export class ${filename}__factory extends Contract {
  static connect(address: string, provider: providers.Provider | Signer): TypedContract<typeof abi> {
    const contract = getContract({ address, abi })
    return contract.connect(provider) as unknown as TypedContract<typeof abi>
  }
}

export type ${filename} = TypedContract<typeof abi>
`.trim()

const inputDirs = ['src/abi/generated', 'src/abi/static']

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (err) {
    console.error(`Error ensuring directory ${dir}:`, err)
  }
}

async function generateExportedAbiFiles() {
  await ensureDir(outputDir)
  const filenames = []

  for (const dir of inputDirs) {
    const files = await fs.readdir(dir)

    for (const file of files) {
      if (path.extname(file) === '.json') {
        const jsonPath = path.join(dir, file)
        const basename = path.basename(file, '.json')
        const tsAbiPath = path.join(outputDir, basename + '_abi.ts')
        const tsClassPath = path.join(outputDir, basename + '.ts')

        try {
          const data = await fs.readFile(jsonPath, 'utf8')
          const tsContent = `export default ${JSON.stringify(JSON.parse(data))} as const`
          await fs.writeFile(tsAbiPath, tsContent)
          console.log(`Generated ${tsAbiPath}`)

          const classContent = generateClassFile(basename)
          await fs.writeFile(tsClassPath, classContent)
          console.log(`Generated ${tsClassPath}`)

          filenames.push(basename)
        } catch (err) {
          console.error(`Error processing ${file}:`, err)
        }
      }
    }
  }

  await createIndexExports(filenames)
}

async function createIndexExports(filenames) {
  const indexPath = path.join(outputDir, 'index.ts')
  const fileContent = filenames.map(filename =>
    `import { ${filename}, ${filename}__factory } from './${filename}'
export { ${filename}, ${filename}__factory }`
  ).join('\n\n')

  await fs.writeFile(indexPath, fileContent)
  console.log(`Generated in ${outputDir}/index.ts`)
}

async function copyFiles() {
  const filesToCopy = [
    { from: path.join(sourceDir, 'ethers-abitype.ts'), to: path.join(outputDir, 'ethers-abitype.ts') }
  ]

  for (const { from, to } of filesToCopy) {
    try {
      await fs.copyFile(from, to)
      console.log(`Copied ${from} to ${to}`)
    } catch (err) {
      console.error(`Error copying file from ${from} to ${to}:`, err)
    }
  }
}

async function main() {
  await generateExportedAbiFiles()
  await copyFiles()
}

main()
