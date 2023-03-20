import path from 'node:path'
import fse from 'fs-extra'
import ora from 'ora'
import { pathExistsSync } from 'path-exists'
import { log } from '@learnmyself.com/utils'

// 获取源文件文职
function getoriginFileDir (template,targetPath) {
  return path.resolve(targetPath,'node_modules',template.npmName,'template')
}

// 复制文件
function copyFile (template,targetPath,finalDir) {
  // 获取源文件未知
  const originFileDir = getoriginFileDir(template, targetPath)
  // 读取文件
  const fileList = fse.readdirSync(originFileDir)
  console.log(fileList);
  const spinner = ora('正在同步拷贝文件...').start()
  fileList.map(file => {
    fse.copySync(`${originFileDir}/${file}`,`${finalDir}/${file}`)
  })
  spinner.stop()
  log.success('拷贝成功')
}

export default function installTemplate (selectedTemplate, opts) {
  const { name, targetPath,template } = selectedTemplate
  const { force = false } = opts
  const rootDir = process.cwd()
  fse.ensureDirSync(targetPath)
  const finalDir = path.resolve(`${rootDir}/${name}`)
  if (pathExistsSync(finalDir)) {
    if (!force) {
      log.error(`当前目录下已存在${rootDir}`)
      return;
    } else {
      fse.removeSync(finalDir)
      fse.ensureDirSync(finalDir)
    }
  } else {
    fse.ensureDirSync(finalDir)
  }
  copyFile(template,targetPath,finalDir)
}