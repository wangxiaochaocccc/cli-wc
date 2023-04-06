import fs from 'node:fs'
import fse from 'fs-extra'
import path from 'node:path'
import simpleGit from 'simple-git'
import Command from '@learnmyself.com/command'
import { log,clearCache,initGitPlatform,initGitType, createRepo, makeInput } from '@learnmyself.com/utils'


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
    const gitIngorePath = path.resolve(cwd, '.gitignore')
    if (!fs.existsSync(gitIngorePath)) {
      log.info('.gitingore不存在,开始创建')
      fs.writeFileSync(gitIngorePath, `.DS_Store
node_modules
/dist
# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`);
      log.info('.gitingore创建完成')
    }
  }
  // 步骤二：初始化本地git
  async initLocalGit () {
    // 获取远程仓库地址
    const gitRemotePath = this.gitResult.githubApi.getRepoUrl(`${this.gitResult.githubApi.login}/${this.name}`)
    // 初始化git
    const gitDir = path.resolve(process.cwd(), '.git')
    this.git =simpleGit({baseDir:process.cwd()})
    if (!fs.existsSync(gitDir)) {
      await this.git.init()
      log.success('git初始化完成')
    }
    // 获取所有remotes
    const remotes = await this.git.getRemotes()
    if (!remotes.find(remote => remote.name === 'origin')) {
      this.git.addRemote('origin', gitRemotePath)
      log.success('添加git remote完成',gitRemotePath)
    }
    // 是否有代码未提交
    await this.checkNotCommit()
    // 检查对应远程分支是否存在
    const tags = await this.git.listRemote(['--refs']);
    if (tags.indexOf('refs/heads/master') >= 0) {
      // 拉去远程分支
      await this.git.pull('origin', 'master').catch(err => {
        if (err.message.indexOf('Couldn\'t find remote ref master') > -1) {
          log.warn('拉去远程[master]分支失败')
        }
      })
    } else {
      await this.pushRemoteRepo('master')
    }
  }
  
  async checkNotCommit () {
    const status = await this.git.status()
    if (status.not_added.length > 0 ||
        status.created.length>0||
        status.deleted.length>0||
        status.modified.length>0||
        status.renamed.length>0
    ) {
      log.info('本地add开始')
      await this.git.add(status.not_added)
      await this.git.add(status.created)
      await this.git.add(status.deleted)
      await this.git.add(status.modified)
      await this.git.add(status.renamed)
      log.success('本地add成功')
      let message
      while (!message) {
        message =await makeInput({
          message:'请输入commit信息：'
        })
      }
      await this.git.commit(message)
      log.success('本地commit成功')
    }
  }
  async pushRemoteRepo (branchName) {
    log.info(`推送代码至远程${branchName}分支`)
    await this.git.push('origin',branchName)
    log.success(`推送代码至远程${branchName}分支成功`)
  }
}


function Commit (instance) {
  return new commitCommand(instance)
}
export default Commit