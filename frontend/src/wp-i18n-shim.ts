import type * as WPI18n from '@wordpress/i18n'

declare global {
  interface Window {
    wp: {
      i18n: typeof WPI18n
    }
  }
}

export const __ = window.wp.i18n.__
export const _n = window.wp.i18n._n
export const _nx = window.wp.i18n._nx
export const _x = window.wp.i18n._x
export const sprintf = window.wp.i18n.sprintf
