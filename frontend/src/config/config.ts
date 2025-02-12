import { toBoolean } from '@helpers/globalHelpers'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const serverVariables = typeof bit_assist_ === 'undefined' ? {} : bit_assist_ // eslint-disable-line camelcase,

const config = {
  AJAX_URL: serverVariables.ajaxURL || 'http://bit-assist.click/wp-admin/admin-ajax.php',
  API_URL: serverVariables.api || 'http://bit-assist.click/wp-json/bit-assist/v1',
  ASSETS_URL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : serverVariables.assetsURL,
  IS_DEV: true,
  IS_PRO: toBoolean(serverVariables.isPro),
  NONCE: serverVariables.nonce || '',
  PRODUCT_NAME: 'Bit Assist',
  ROOT_URL: serverVariables.rootURL,
  ROUTE_PREFIX: serverVariables.routePrefix || 'bit_assist_'
}

export default config
