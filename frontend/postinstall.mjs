import fse from 'fs-extra'
import path from 'node:path'

const topDirectory = import.meta.dirname
fse.emptyDirSync(path.join(topDirectory, '../assets', 'tinymce'))
fse.copySync(
  path.join(topDirectory, 'node_modules', 'tinymce'),
  path.join(topDirectory, '../assets', 'tinymce'),
  {
    overwrite: true
  }
)
