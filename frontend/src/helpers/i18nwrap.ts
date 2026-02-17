/**
 * WordPress i18n wrapper functions for Bit Assist plugin.
 *
 * These functions provide translation capabilities using the @wordpress/i18n package.
 * All strings are registered under the 'bit-assist' text domain.
 *
 * @module i18nwrap
 */

/* eslint-disable no-restricted-imports */
import { __ as i18n__, _x as i18n_x, sprintf as i18nsprintf } from '@wordpress/i18n'

const DOMAIN = 'bit-assist'

/**
 * Translate a string.
 *
 * Uses @wordpress/i18n with the bit-assist domain.
 *
 * @param text - The string to translate
 * @param domain - Optional text domain (defaults to 'bit-assist')
 * @returns The translated string
 *
 * @example
 * ```tsx
 * const greeting = __('Hello World')
 * ```
 */
export const __ = (text: string, domain = DOMAIN): string => i18n__(text, domain)

/**
 * Translate a string with context.
 *
 * Use this when the same string might have different translations depending on context.
 * For example, "Post" as a noun (blog post) vs. "Post" as a verb (to post).
 *
 * @param text - The string to translate
 * @param context - Context to disambiguate the translation
 * @param domain - Optional text domain (defaults to 'bit-assist')
 * @returns The translated string
 *
 * @example
 * ```tsx
 * // "Settings" as a noun (page title)
 * const pageTitle = _x('Settings', 'page title')
 *
 * // "Settings" as a verb (button action)
 * const buttonLabel = _x('Settings', 'button action')
 * ```
 */
export const _x = (text: string, context: string, domain = DOMAIN): string =>
  i18n_x(text, context, domain)

/**
 * Format a string with placeholders.
 *
 * Uses sprintf-style formatting. Commonly used with translated strings that need dynamic values.
 *
 * @param text - Format string with placeholders (%s, %d, etc.)
 * @param vars - Values to substitute into the placeholders
 * @returns The formatted string
 *
 * @example
 * ```tsx
 * // Simple string substitution
 * const message = sprintf(__('Hello %s'), userName)
 *
 * // Multiple placeholders
 * const status = sprintf(__('%d of %d items completed'), completed, total)
 * ```
 */
export const sprintf = (text: string, ...vars: unknown[]): string => i18nsprintf(text, ...vars)
