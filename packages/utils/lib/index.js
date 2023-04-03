import  log from './log.js'
import  isDebug from './isDebug.js'
import  checkNodeVersion from './checkNodeVersion.js'
import {makeList,makeInput,makePassword} from './inquirer.js'
import { getNpmLatestVersion } from './npm.js'
import { printLog } from './printLog.js'
import request from './request.js'
import github from './git/github.js'
import gitee from './git/gitee.js'
import { getPlatform } from './git/gitServer.js'
import {initGitPlatform,initGitType} from './git/gitInit.js'

export {
  log,
  isDebug,
  checkNodeVersion,
  makeList,
  makeInput,
  makePassword,
  getNpmLatestVersion,
  printLog,
  request,
  github,
  gitee,
  getPlatform,
  initGitPlatform,
  initGitType
}