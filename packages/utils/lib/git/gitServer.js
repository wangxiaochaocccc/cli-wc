import path from 'node:path'
import fs from 'fs'
import fse from 'fs-extra'
import {execa} from 'execa'
import  {homedir} from 'node:os'
import { pathExistsSync } from 'path-exists'
import { makePassword } from '../inquirer.js'
import log from '../log.js'
// import { exec } from 'node:child_process'

const TEMP_DIR = '.wc-cli'
const TOKEN_PATH = '.token'
const PLATFORM_PATH = '.platform'
// 获取token地址
function getTokenPath () {
  return path.resolve(homedir(),TEMP_DIR,TOKEN_PATH)
}
// 获取platform地址
function getTPlatformPath () {
  return path.resolve(homedir(),TEMP_DIR,PLATFORM_PATH)
}
// 获取platform内容
function getPlatform () {
  if (pathExistsSync(getTPlatformPath())) {
    return fse.readFileSync(getTPlatformPath()).toString()
  }
  return null
}
// 获取项目地址
function getProjectPath (cwd,fullName) {
  const projectName = fullName.split('/')[1]
  return path.resolve(cwd,projectName)
}
// 获取pkg
function getPackageJSon (cwd,fullName) {
  const pathPro = getProjectPath(cwd, fullName)
  const pkgPath = path.resolve(pathPro, 'package.json')
  if (pathExistsSync(pkgPath)) {
    return fse.readJSONSync(pkgPath)
  }
  return null
}

class gitServer {
  constructor() {}
  async init () {
    // 判断是否有token
    const tokenPath = getTokenPath()
    log.verbose('tokenPath',tokenPath)
    if (pathExistsSync(tokenPath)) {
      this.token = fse.readFileSync(tokenPath)
    } else {
      this.token = await this.getToken()
      fs.writeFileSync(getTokenPath(),this.token)
      log.verbose('Token',this.token)
    }
  }
  getToken () {
    return makePassword({
      message:'请填写token信息'
    })
  }
  savePlatformPath (platform) {
    fs.writeFileSync(getTPlatformPath(),platform)
  }
  // 下载方法
  cloneRepo (fullName, tags) {
    if (tags) {
      return execa('git',['clone',this.getRepoUrl(fullName),'-b',tags])
    } else {
      return execa('git',['clone',this.getRepoUrl(fullName)])
    }
  }
  // 安装依赖
  installDependences (cwd, fullName) {
    const projectName = fullName.split('/')[1]
    const pathName = path.resolve(cwd, projectName)
    console.log(pathName);
    if (pathExistsSync(pathName)) {
      return execa('npm',['install','--registry=https://registry.npmmirror.com'],{cwd:pathName})
    }
    return null
  }
  // 启动项目
  runRepo (cwd, fullName) {
    const pathPro = getProjectPath(cwd, fullName)
    const pkg = getPackageJSon(cwd, fullName)
    if (pkg) {
      const { scripts, bin, name } = pkg 
      if (scripts?.bin) {
        return execa('npm', ['install', '-g', name, '--registry=https://registry.npmmirror.com'], {
          cwd: pathPro,
          stdout: 'inherit'
        })
      }
      if (scripts?.dev) {
        return execa('npm',['run','dev'],{cwd:pathPro,stdout:'inherit'})
      } else if (scripts?.start) {
        return execa('npm',['run','start'],{cwd:pathPro,stdout:'inherit'})
      } else {
        log.warn('未找到启动命令')
      }
    }
  }
}

export {
  getPlatform,
  gitServer
} 