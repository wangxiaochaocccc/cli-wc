import path from 'node:path'
import {pathExistsSync} from 'path-exists'
import fse from 'fs-extra'
import ora from 'ora'
import { printLog, log } from '@learnmyself.com/utils'

// 创建缓存目录
function makeCacheDir (targetPath) {
  const cacheDir = getCacheDir(targetPath)
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir)
  }
  const spinner = ora('正在下载模板...').start()
  try {
    setTimeout(() => {
      spinner.stop()
      log.success('模板下载成功')
    },3000)
  } catch (e) {
    spinner.stop()
    printLog(e)
  }
}
function getCacheDir(targetPath){
  return path.resolve(targetPath,'node_modules')
}
export default function downloadTemplate (selectedTemplate) {
  const { template, targetPath } = selectedTemplate
  makeCacheDir(targetPath)
}