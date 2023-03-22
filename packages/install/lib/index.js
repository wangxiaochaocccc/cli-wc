import Command from '@learnmyself.com/command'
import {github, log,makeList,getPlatform} from '@learnmyself.com/utils'

class initCommand extends Command {
  get command () {
    return 'install'
  }
  get description () {
    return 'install project'
  }
  async action () {
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
    }
    await githubApi.init()
    await githubApi.savePlatformPath(platform)
    // 搜索respositories
    const searchResult = await githubApi.search({
      q: 'vue',
      sort: 'stars',
      order: 'desc',
      per_page: 2,
      page:1
    })
    console.log(searchResult,111);
  }
  get options () {}
}

function InstallCommand (instance) {
  return new initCommand(instance)
}
export default InstallCommand