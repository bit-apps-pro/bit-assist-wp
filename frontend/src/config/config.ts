// eslint-disable-next-line camelcase, @typescript-eslint/ban-ts-comment
// @ts-ignore
const serverVariables = typeof bit_assist_ === 'undefined' ? {} : bit_assist_ // eslint-disable-line camelcase,

const config = {
  PRODUCT_NAME: 'Bit Assist',
  IS_DEV: true,
  AJAX_URL: serverVariables.ajaxURL || 'http://bit-assist.click/wp-admin/admin-ajax.php',
  API_URL: serverVariables.api || 'http://bit-assist.click/wp-json/bit-assist/v1',
  NONCE: serverVariables.nonce || '',
  ROUTE_PREFIX: serverVariables.routePrefix || 'bit_assist_',
  ROOT_URL: serverVariables.rootURL,
  ASSETS_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : serverVariables.assetsURL,
  IS_PRO: serverVariables.isPro || false,
}

export default config
