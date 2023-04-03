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
  log.verbose('user', user)
  // user or orgnization
  let gitOwn //仓库类型
  let gitLogin //仓库登录名
  if (!gitOwn) {
    gitOwn = await makeList({
      message: '请选择仓库类型：',
      choices: [
        {name:'User',value:'user'},
        {name:'Orgnization',value:'orgnization'},
      ]
    })
  }
  if (gitOwn === 'user') {
    gitLogin=user?.login
  } else {
    const orgsList = orgs.map(item => ({
      name: item.name,
      value:item.name
    }))
    gitLogin = await makeList({
      message: '请选择组织：',
      choices: orgsList
    })
  }
  log.verbose('gitLogin',gitLogin)
  if (!gitLogin) {
    throw new Error('没有git登录名')
  }
}

export {
  initGitPlatform,
  initGitType
}