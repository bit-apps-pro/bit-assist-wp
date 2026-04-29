#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { program } from 'commander'

program
  .name('update-version')
  .description('Update the plugin version in index.php, readme.txt, and Config.php')
  .requiredOption('-v, --version <char>', 'specify the new version')
  .addHelpText(
    'after',
    `
  Example:
    $ node frontend/scripts/update-version.mjs --version 1.2.3
    `,
  )
  .parse()

const { version } = program.opts()

const root = path.resolve(import.meta.dirname, '../../')

await Promise.all([
  updateVersion({
    filePath: path.join(root, 'index.php'),
    regex: /Version:\s*([\d.]+)/,
    replacement: `Version:     ${version}`,
  }),
  updateVersion({
    filePath: path.join(root, 'readme.txt'),
    regex: /Stable tag:\s*([\d.]+)/,
    replacement: `Stable tag: ${version}`,
  }),
  updateVersion({
    filePath: path.join(root, 'backend/app/Config.php'),
    regex: /public const VERSION\s*=\s*'[\d.]+';/,
    replacement: `public const VERSION = '${version}';`,
  }),
])

async function updateVersion({ filePath, regex, replacement }) {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    const updatedData = data.replace(regex, replacement)
    fs.writeFileSync(filePath, updatedData, 'utf8')
    console.log(`✔️  ${path.relative(root, filePath)} updated to ${version}`)
  } catch (error) {
    console.error(`✖  ${path.relative(root, filePath)}:`, error.message)
  }
}
