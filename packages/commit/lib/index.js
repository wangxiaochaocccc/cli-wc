import fs from 'node:fs'
import fse from 'fs-extra'
import path from 'node:path'
import SimpleGit from 'simple-git'
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
    await this.createRemoteRepo()
    await this.initLocalGit()
  }
  // 步骤一：创建远程仓库
  async createRemoteRepo () {
    // 如果没有平台信息，走选择平台逻辑
    this.gitResult = await initGitPlatform()
    log.verbose('gitResult', this.gitResult)
    // 仓库类型选择
    await initGitType(this.gitResult.githubApi)
    // 创建仓库
    // 获取pkg.name
    const cwd = process.cwd()
    const pkgPath = path.resolve(cwd, 'package.json')
    const pkg = fse.readJSONSync(pkgPath)
    this.name = pkg.name
    await createRepo(this.gitResult.githubApi, this.name)
    // 创建gitingore
    const gitIngorePath = path.resolve(cwd, '.gitingore')
    if (!fs.existsSync(gitIngorePath)) {
      log.info('.gitingore不存在,开始创建')
      fs.writeFileSync(gitIngorePath,`# Logs
      logs
      *.log
      npm-debug.log*
      yarn-debug.log*
      yarn-error.log*
      pnpm-debug.log*
      lerna-debug.log*
      node_modules
      dist
      dist-ssr
      *.local
      # Editor directories and files
      .vscode/*
      !.vscode/extensions.json
      .idea
      .DS_Store
      *.suo
      *.ntvs*
      *.njsproj
      *.sln
      *.sw?
      `)
      log.info('.gitingore创建完成')
    }
  }
  // 步骤二：初始化本地git
  async initLocalGit () {
    // 获取远程仓库地址
    const gitRemotePath = this.gitResult.githubApi.getRepoUrl(`${this.gitResult.githubApi.login}/${this.name}`)
    // 初始化git
    const git = new SimpleGit(process.cwd())
    git.init()
  }
}


function Commit (instance) {
  return new commitCommand(instance)
}
export default Commit