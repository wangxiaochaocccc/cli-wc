import path from 'node:path'
import { pathExistsSync } from 'path-exists'
import fse from 'fs-extra'
import { log } from '@learnmyself.com/utils'

export default function installTemplate (selectedTemplate, opts) {
  const { name, targetPath } = selectedTemplate
  const { force = false } = opts
  const rootDir = process.cwd()
  fse.ensureDirSync(targetPath)
  const finalDir = path.resolve(`${rootDir}/${name}`)
  if (pathExistsSync(finalDir)) {
    if (!force) {
      log.error(`当前目录下已存在${rootDir}`)
      // return;
    } else {
      fse.removeSync(finalDir)
      fse.ensureDirSync(finalDir)
    }
  } else {
    fse.ensureDirSync(finalDir)
  }
}