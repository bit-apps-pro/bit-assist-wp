#!/usr/bin/env node
/* eslint-env node */
/* global process */

/**
 * Converts PO files to JED JSON format for WordPress JavaScript translations.
 *
 * Usage: node po-to-jed.mjs <languages-dir> <domain> <script-handle>
 * Example: node po-to-jed.mjs ../languages bit-assist bit-assist-index-MODULE
 */

import gettextParser from 'gettext-parser'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [languagesDirectory, domain, handle] = process.argv.slice(2)

if (!languagesDirectory || !domain || !handle) {
  console.error('Usage: node po-to-jed.mjs <languages-dir> <domain> <script-handle>')
  process.exit(1)
}

if (!existsSync(languagesDirectory)) {
  console.error(`Error: Directory not found: ${languagesDirectory}`)
  process.exit(1)
}

const poPattern = new RegExp(`^${domain}-(.+)\\.po$`)
const poFiles = readdirSync(languagesDirectory).filter(f => poPattern.test(f))

if (poFiles.length === 0) {
  // eslint-disable-next-line no-console -- CLI script; intentional stdout for "no files" status
  console.log('No PO files found.')
  process.exit(0)
}

for (const poFile of poFiles) {
  try {
    const locale = poFile.match(poPattern)[1]
    const poPath = join(languagesDirectory, poFile)
    const jsonPath = join(languagesDirectory, `${domain}-${locale}-${handle}.json`)

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
