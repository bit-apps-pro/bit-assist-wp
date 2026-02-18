/* global wp */
/**
 * i18n helper for widget-iframe. Uses wp.i18n when available (WordPress context).
 * @param {string} text - String to translate
 * @returns {string} Translated string or original if wp.i18n unavailable
 */
export const __ = text =>
  (typeof wp !== 'undefined' && wp?.i18n ? wp.i18n.__(text, 'bit-assist') : text)

/**
 * @param {string} text - Format string with %s placeholders
 * @param {...unknown} args - Values to substitute
 * @returns {string}
 */
export const sprintf = (text, ...args) =>
  (typeof wp !== 'undefined' && wp?.i18n
    ? wp.i18n.sprintf(text, ...args)
    : text.replace(/%\d+\$s|%s/g, () => args.shift() ?? ''))
