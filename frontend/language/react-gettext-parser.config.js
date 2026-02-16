/**
 * Config for react-gettext-parser - extracts __(), _x(), sprintf() from frontend.
 * @see https://github.com/laget-se/react-gettext-parser
 */
module.exports = {
  funcArgumentsMap: {
    __: ['msgid'],
    _n: ['msgid', 'msgid_plural'],
    _nx: ['msgid', 'msgid_plural', null, 'msgctxt'],
    _x: ['msgid', 'msgctxt'],
    gettext: ['msgid'],
    sprintf: ['msgid']
  },
  trim: true
}
