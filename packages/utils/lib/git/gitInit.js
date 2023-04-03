import { makeList } from '../inquirer.js'
import { getPlatform } from './gitServer.js'
import log from '../log.js'
import gitee from './gitee.js'
import github from './github.js'

// 平台选择逻辑
async function initGitPlatform () {
  let platform = getPlatform()
  if (!platform) {
    // 选择git平台
    platform=await makeList({
      choices: [
        {name:'GitHub',value:'github'},
        {name:'Gitee',value:'gitee'},
      ],
      message:"请选择git平台"
    })
  }
  log.verbose("Paltform", platform)
  // 平台选择后
  let githubApi
  if (platform === 'github') {
    githubApi = new github()
  } else {
    githubApi = new gitee()
  }
  await githubApi.init()
  await githubApi.savePlatformPath(platform)
  return {githubApi,platform}
  // this.platform = platform
}
// git类型：组织，个人
async function initGitType (gitApi) {
  const orgs = await gitApi.getOrg()
  const user = await gitApi.getUser()
  log.verbose('orgs',orgs)
  log.verbose('user',user)
}

export {
  initGitPlatform,
  initGitType
}