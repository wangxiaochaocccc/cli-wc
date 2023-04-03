// import {homedir} from 'node:os'
import Command from '@learnmyself.com/command'
import { log,clearCache,initGitPlatform,initGitType } from '@learnmyself.com/utils'


class commitCommand extends Command {
  get command () {
    return 'commit'
  }
  get description () {
    return 'commit code'
  }
  get options () { 
    return [
      ['-c,--clear','清空缓存',false]
    ]
  }

  async action ([{ clear }]) {
    if (clear) {
      await clearCache()
    }
    this.createRemoteRepo()
  }
  // 步骤一：创建远程仓库
  async createRemoteRepo () {
    // 如果没有平台信息，走选择平台逻辑
    const gitResult = await initGitPlatform()
    log.verbose('gitResult', gitResult)
    await initGitType(gitResult.githubApi)
  }
}


function Commit (instance) {
  return new commitCommand(instance)
}
export default Commit