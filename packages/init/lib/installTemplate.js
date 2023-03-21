import path from 'node:path'
import fse from 'fs-extra'
import ora from 'ora'
import ejs from 'ejs'
import {glob} from 'glob'
import { pathExistsSync } from 'path-exists'
import { log,makeList } from '@learnmyself.com/utils'

// 获取源文件位置
function getoriginFileDir (template,targetPath) {
  return path.resolve(targetPath,'node_modules',template.npmName,'template')
}
// 获取plugin位置
function getPluginFileDir (template, targetPath) {
  return path.resolve(targetPath,'node_modules',template.npmName,'plugins/index.js')
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
// 执行插件
async function exePlugins (targetPath, template) {
  const pluginPath = getPluginFileDir(targetPath, template)
  let data = {}
  let api = {
    makeList
  }
  if (pathExistsSync(pluginPath)) {
    const pluginFun = (await import(pluginPath)).default
    data = await pluginFun(api)
  }
  return data
}
// ejs渲染
async function ejsRender (targetPath, finalDir, template, name) {
   // 执行插件
  const data = await exePlugins(template, targetPath)
  
  const ejsData = {
    data: {
      name,
      ...data
    }
  }
  const { ignore } = template
  log.verbose('ejsRender', ignore, ejsData)
 
  await glob('**', {
    cwd: finalDir,
    nodir: true,
    ignore: [
     ...ignore,
      '**/node_modules/**',
    ]
  }).then(fileList => {
    fileList.forEach(file => {
      const filePath = path.join(finalDir, file)
      ejs.renderFile(filePath, ejsData, (err,result) => {
        if (!err) {
          fse.writeFileSync(filePath,result)
        } else {
          log.error(err)
        }
      })
    })
  })
}

export default async function installTemplate (selectedTemplate, opts) {
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
  await copyFile(template, targetPath, finalDir)
  // ejs渲染
  await ejsRender(targetPath,finalDir,template,name)
}