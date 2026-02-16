/* eslint-disable no-restricted-imports */
import { __ as i18n__, _x as i18n_x, sprintf as i18nsprintf } from '@wordpress/i18n'

const DOMAIN = 'bit-assist'

/**
 * Translate a string. Uses @wordpress/i18n with the bit-assist domain.
 */
export const __ = (text: string, domain = DOMAIN): string => i18n__(text, domain)

/**
 * Translate a string with context. Uses @wordpress/i18n with the bit-assist domain.
 */
export const _x = (text: string, context: string, domain = DOMAIN): string =>
  i18n_x(text, context, domain)

/**
 * Format a string with placeholders. Uses @wordpress/i18n sprintf.
 */
export const sprintf = (text: string, ...vars: unknown[]): string => i18nsprintf(text, ...vars)
