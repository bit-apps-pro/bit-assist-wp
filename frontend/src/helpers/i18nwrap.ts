/* eslint-disable no-restricted-imports */
import { __ as i18n__, sprintf as i18nsprintf } from '@wordpress/i18n'

const DOMAIN = 'bit-assist'

/** Translate a string using the bit-assist text domain. */
export const __ = (text: string, domain = DOMAIN): string => i18n__(text, domain)

/** Format a translated string with sprintf-style placeholders. */
export const sprintf = (text: string, ...vars: unknown[]): string => i18nsprintf(text, ...vars)
