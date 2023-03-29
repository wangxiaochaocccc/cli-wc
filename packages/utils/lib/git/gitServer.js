import path from 'node:path'
import fs from 'fs'
import fse from 'fs-extra'
import {execa} from 'execa'
import  {homedir} from 'node:os'
import { pathExistsSync } from 'path-exists'
import { makePassword } from '../inquirer.js'
import log from '../log.js'

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
}

export {
  getPlatform,
  gitServer
} 