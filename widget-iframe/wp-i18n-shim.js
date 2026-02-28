export const __ = window?.wp?.i18n?.__ || (str => str)
export const sprintf = window?.wp?.i18n?.sprintf || ((str, ...args) => {
  let i = 0
  return str.replace(/%([1-9])\$s|%s/g, (_, n) => String(n !== undefined ? args[n - 1] : args[i++]))
})
