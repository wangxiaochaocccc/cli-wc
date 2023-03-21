import path from 'node:path'
import fse from 'fs-extra'
import ora from 'ora'
import ejs from 'ejs'
import {glob} from 'glob'
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
  log.verbose(fileList);
  const spinner = ora('正在同步拷贝文件...').start()
  fileList.map(file => {
    fse.copySync(`${originFileDir}/${file}`,`${finalDir}/${file}`)
  })
  spinner.stop()
  log.success('拷贝成功')
}

async function ejsRender (finalDir) {
  await glob('**', {
    cwd: finalDir,
    nodir: true,
    ignore: [
      '**/public/**',
      '**/node_modules/**',
    ]
  }).then(fileList => {
    fileList.forEach(file => {
      const filePath = path.join(finalDir, file)
      ejs.renderFile(filePath, {
        data: {
          name:'vue-template1'
        }
      }, (err,result) => {
        if (!err) {
          fse.writeFileSync(filePath,result)
        } else {
          log.error(err)
        }
      })
    })
  })
}

export default function installTemplate (selectedTemplate, opts) {
  const { name, targetPath,template } = selectedTemplate
  const { force = false } = opts
  const rootDir = process.cwd()
  fse.ensureDirSync(targetPath)
  const finalDir = path.resolve(`${rootDir}/${name}`)
  if (pathExistsSync(finalDir)) {
    if (!force) {
      log.error(`当前目录下已存在${rootDir}/${name}`)
      return;
    } else {
      fse.removeSync(finalDir)
      fse.ensureDirSync(finalDir)
    }
  } else {
    fse.ensureDirSync(finalDir)
  }
  copyFile(template, targetPath, finalDir)
  // ejs渲染
  ejsRender(finalDir)
}