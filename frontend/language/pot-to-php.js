#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const gettextParser = require('gettext-parser')
const _ = require('lodash')
const fs = require('node:fs')

const TAB = '    '
const NEWLINE = '\n'
const args = process.argv.slice(2)
const fileHeader =
  ['<?php', '/* THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY. */', `$i18nStrings = array(`].join(
    NEWLINE
  ) + NEWLINE

const fileFooter =
  NEWLINE + [');', '/* THIS IS THE END OF THE GENERATED FILE */'].join(NEWLINE) + NEWLINE

function escapeSingleQuotes(input) {
  return input.replaceAll("'", String.raw`\'`)
}

function convertTranslationToPHP(translation, textdomain, context) {
  let php = ''
  let original = translation.msgid

  if (original !== '') {
    original = escapeSingleQuotes(original)

    if (_.isEmpty(translation.msgid_plural)) {
      php += _.isEmpty(context)
        ? `${TAB}'${original}' => __('${original}', '${textdomain}')`
        : `${TAB}'${original}' => _x('${original}', '${translation.msgctxt}', '${textdomain}')`
    } else {
      const plural = escapeSingleQuotes(translation.msgid_plural)

      php += _.isEmpty(context)
        ? `${TAB}'${original}' => _n_noop('${original}', '${plural}', '${textdomain}')`
        : `${TAB}'${original}' => _nx_noop('${original}',  '${plural}', '${translation.msgctxt}', '${textdomain}')`
    }
  }

  return php
}

function convertPOTToPHP(potFile, phpFile, options) {
  const poContents = fs.readFileSync(potFile)
  const parsedPO = gettextParser.po.parse(poContents)

  let output = []

  for (const context of Object.keys(parsedPO.translations)) {
    const translations = parsedPO.translations[context]

    const newOutput = Object.values(translations)
      .map(translation => convertTranslationToPHP(translation, options.textdomain, context))
      .filter(php => php !== '')

    output = [...output, ...newOutput]
  }

  const fileOutput = fileHeader + output.join(`,${NEWLINE}${NEWLINE}`) + fileFooter

  fs.writeFileSync(phpFile, fileOutput)
}

convertPOTToPHP(args[0], args[1], {
  textdomain: args[2]
})
