#!/usr/bin/env node
/* eslint-env node */
/* global process */

/**
 * Converts PO files to JED JSON format for WordPress JavaScript translations.
 *
 * Usage: node po-to-jed.mjs <languages-dir> <domain> <script-handle> [po-prefix]
 *
 * If po-prefix is provided, matches PO files named {po-prefix}-{locale}.po
 * (e.g. bit-assist-frontend-bn_BD.po). Output JSON is always {domain}-{locale}-{handle}.json.
 *
 * Example: node po-to-jed.mjs ../languages bit-assist bit-assist-index-MODULE bit-assist-frontend
 */

import gettextParser from 'gettext-parser'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const [languagesDirectory, domain, handle, poPrefix] = process.argv.slice(2)

if (!languagesDirectory || !domain || !handle) {
  console.error('Usage: node po-to-jed.mjs <languages-dir> <domain> <script-handle> [po-prefix]')
  process.exit(1)
}

// Resolve relative to cwd (where pnpm/npm runs the script from, i.e. frontend/)
const languagesDir = path.resolve(process.cwd(), languagesDirectory)
if (!existsSync(languagesDir)) {
  console.error(`Error: Directory not found: ${languagesDir}`)
  process.exit(1)
}

const poFilePrefix = poPrefix || domain
const poPattern = new RegExp(
  `^${poFilePrefix.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)}-(.+)\\.po$`
)
const poFiles = readdirSync(languagesDir).filter(f => poPattern.test(f))

if (poFiles.length === 0) {
  // eslint-disable-next-line no-console -- CLI script; intentional stdout for "no files" status
  console.log('No PO files found.')
  process.exit(0)
}

for (const poFile of poFiles) {
  try {
    const locale = poFile.match(poPattern)[1]
    const poPath = path.join(languagesDir, poFile)
    const jsonPath = path.join(languagesDir, `${domain}-${locale}-${handle}.json`)

    const parsed = gettextParser.po.parse(readFileSync(poPath))

    const messages = {
      '': {
        domain,
        lang: locale,
        plural_forms: parsed.headers?.['plural-forms'] || 'nplurals=2; plural=(n != 1);'
      }
    }

    for (const [context, entries] of Object.entries(parsed.translations)) {
      for (const [msgid, entry] of Object.entries(entries)) {
        if (msgid === '') continue

        const key = context ? `${context}\u0004${msgid}` : msgid
        const translatedStrings = (entry.msgstr || []).filter(s => s !== '')

        if (translatedStrings.length > 0) {
          messages[key] = translatedStrings
        }
      }
    }

    const jedJson = {
      domain,
      locale_data: { [domain]: messages },
      'translation-revision-date': parsed.headers?.['po-revision-date'] || ''
    }

    writeFileSync(jsonPath, JSON.stringify(jedJson))
    // eslint-disable-next-line no-console -- CLI script; intentional stdout for success output
    console.log(`✓ ${poFile} → ${domain}-${locale}-${handle}.json`)
  } catch (error) {
    console.error(`✗ Error processing ${poFile}:`, error.message)
    process.exit(1)
  }
}
