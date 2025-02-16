// interface cls { [key: string]: string; }

// declare module '*.module.css' {
//   const classes: { [key: string]: string }
//   export = classes
// }

declare module '*.module.css'
declare module '*.module.scss'
declare module '*.module.sass'
declare module '*.svg'

declare let bitapp
declare let wp

declare let __webpack_public_path__ // eslint-disable-line camelcase

declare module 'vite/client'

declare module 'i18nwrap'

type KeyedValueHandler<T> = <K extends keyof T>(key: K, value: T[K]) => void
