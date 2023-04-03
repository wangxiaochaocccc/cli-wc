// import {homedir} from 'node:os'
import Command from '@learnmyself.com/command'
import { log,getPlatform,initGitPlatform } from '@learnmyself.com/utils'


class commitCommand extends Command {
  get command () {
    return 'commit'
  }
  get description () {
    return 'commit code'
  }
  get options () { }

  async action () {
   this.createRemoteRepo()
  }
  // 步骤一：创建远程仓库
  async createRemoteRepo () {
    // 获取平台信息
    const platform = await getPlatform()
    log.verbose('platform', platform)
    // 如果没有平台信息，走选择平台逻辑
    const gitResult = await initGitPlatform()
    log.verbose('gitResult',gitResult)
  }
}


function Commit (instance) {
  return new commitCommand(instance)
}
export default Commit