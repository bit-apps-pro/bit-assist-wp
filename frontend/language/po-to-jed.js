#!/usr/bin/env node

/**
 * Converts PO files to JED JSON for wp_set_script_translations.
 *
 * Usage: node po-to-jed.js <languages-dir> <domain>
 * Reads:  <languages-dir>/<domain>-<locale>.po
 * Writes: <languages-dir>/<domain>-<locale>.json
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const gettextParser = require('gettext-parser')
const fs = require('node:fs')
const path = require('node:path')

const args = process.argv.slice(2)
const languagesDir = args[0]
const domain = args[1]

if (!languagesDir || !domain) {
  console.error('Usage: node po-to-jed.js <languages-dir> <domain>')
  process.exit(1)
}

const poPattern = new RegExp(`^${domain}-(.+)\\.po$`)
const poFiles = fs.readdirSync(languagesDir).filter(f => poPattern.test(f))

if (poFiles.length === 0) {
  console.log('No PO files found.')
  process.exit(0)
}

for (const poFile of poFiles) {
  const locale = poFile.match(poPattern)[1]
  const poPath = path.join(languagesDir, poFile)
  const jsonPath = path.join(languagesDir, `${domain}-${locale}.json`)

  const poContents = fs.readFileSync(poPath)
  const parsed = gettextParser.po.parse(poContents)

  const messages = {
    '': {
      domain: 'messages',
      lang: locale,
      // eslint-disable-next-line camelcase
      plural_forms: parsed.headers['plural-forms'] || 'nplurals=2; plural=(n != 1);'
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
    'translation-revision-date': parsed.headers['po-revision-date'] || '',
    generator: 'po-to-jed',
    domain: 'messages',
    // eslint-disable-next-line camelcase
    locale_data: { messages }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(jedJson))
  console.log(`Created ${jsonPath}`)
}
