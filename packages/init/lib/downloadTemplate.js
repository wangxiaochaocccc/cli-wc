import path from 'node:path'
import {pathExistsSync} from 'path-exists'
import fse from 'fs-extra'
import ora from 'ora'
import {execa} from 'execa'
import { printLog, log } from '@learnmyself.com/utils'

// 创建缓存目录
function makeCacheDir (targetPath) {
  const cacheDir = getCacheDir(targetPath)
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir)
  }
}
// 获取目录路径
function getCacheDir(targetPath){
  return path.resolve(targetPath,'node_modules')
}
// 下载模板
async function downloadAddTemplate (template, targetPath) {
  const { npmName,version } = template
  const installCommand = 'npm'
  const installArgs = ['install', `${npmName}@${version}`]
  const cwd = targetPath
  log.verbose(installArgs)
  log.verbose(targetPath)
  await execa(installCommand,installArgs,{cwd})
}

// 下载模板整体
export default async function downloadTemplate (selectedTemplate) {
  const { template, targetPath } = selectedTemplate
  makeCacheDir(targetPath)
  const spinner = ora('正在下载模板...').start()
  try {
      await downloadAddTemplate(template,targetPath)
      spinner.stop()
      log.success('模板下载成功')
  } catch (e) {
    spinner.stop()
    printLog(e)
  }
}