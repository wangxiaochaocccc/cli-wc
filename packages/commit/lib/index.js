import fse from 'fs-extra'
import path from 'node:path'
import Command from '@learnmyself.com/command'
import { log,clearCache,initGitPlatform,initGitType, createRepo } from '@learnmyself.com/utils'


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
    // 仓库类型选择
    await initGitType(gitResult.githubApi)
    // 创建仓库
    // 获取pkg.name
    const cwd = process.cwd()
    const pkgPath = path.resolve(cwd, 'package.json')
    const pkg = fse.readJSONSync(pkgPath)
    await createRepo(gitResult.githubApi,pkg.name)
  }
}


function Commit (instance) {
  return new commitCommand(instance)
}
export default Commit