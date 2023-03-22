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
    const platform = getPlatform()
    if (!platform) {
      // 选择git平台
      await makeList({
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
    githubApi.savePlatformPath(platform)
    githubApi.init()
  }
  get options () {}
}

function InstallCommand (instance) {
  return new initCommand(instance)
}
export default InstallCommand