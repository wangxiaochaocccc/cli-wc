import { makeList } from '../inquirer.js'
import { getPlatform,getOwn,getLogin } from './gitServer.js'
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
  // user or orgnization
  let gitOwn = getOwn() //仓库类型
  let gitLogin = getLogin() //仓库登录名
  if (!gitLogin&&!gitOwn) {
    const orgs = await gitApi.getOrg()
    const user = await gitApi.getUser()
    log.verbose('orgs',orgs)
    log.verbose('user', user)
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
      if (!orgs.length) {
        log.error("您暂时还没有组织，所以，强制结束本次流程")
        return
      }
      const orgsList = orgs.map(item => ({
        name: item.name,
        value:item.login
      }))
      gitLogin = await makeList({
        message: '请选择组织：',
        choices: orgsList
      })
    }
  }
  await gitApi.saveLogin(gitLogin)
  await gitApi.saveOwn(gitOwn)
  log.verbose('gitLogin', gitLogin)
  if (!gitLogin || !gitOwn) {
    throw new Error('没有git登录名信息，请执行‘wc-cli commit --clear’,重新填写相关信息')
  }
}
// 创建仓库
async function createRepo (gitApi,name) {
  const res = await gitApi.createRepoFun(name)
  console.log(res);
}

export {
  initGitPlatform,
  initGitType,
  createRepo
}