const fse = require('fs-extra')
const path = require('path')
const topDir = __dirname
fse.emptyDirSync(path.join(topDir, '../assets', 'tinymce'))
fse.copySync(path.join(topDir, 'node_modules', 'tinymce'), path.join(topDir, '../assets', 'tinymce'), {
  overwrite: true,
})
