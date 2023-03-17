import path from 'node:path'
import {pathExistsSync} from 'path-exists'
import fse from 'fs-extra'

// 创建缓存目录
function makeCacheDir (targetPath) {
  const cacheDir = getCacheDir(targetPath)
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir)
  }
}
function getCacheDir(targetPath){
  return path.resolve(targetPath,'node_modules')
}
export default function downloadTemplate (selectedTemplate) {
  const { template, targetPath } = selectedTemplate
  console.log(targetPath);
  makeCacheDir(targetPath)
}