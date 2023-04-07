import fs from 'node:fs'
import fse from 'fs-extra'
import path from 'node:path'
import simpleGit from 'simple-git'
import semver from 'semver'
import Command from '@learnmyself.com/command'
import { log,clearCache,initGitPlatform,initGitType, createRepo, makeInput, makeList } from '@learnmyself.com/utils'


class commitCommand extends Command {
  get command () {
    return 'commit'
  }
  get description () {
    return 'commit code'
  }
  get options () { 
    return [
      ['-c,--clear','清空缓存',false],
      ['-p,--publish','发布代码',false],
    ]
  }

  async action ([{ clear,publish }]) {
    if (clear) {
      await clearCache()
    }
    await this.createRemoteRepo()
    await this.initLocalGit()
    await this.commit()
    if (publish) {
      await this.publish()
    }
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
    this.version = pkg.version
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
      log.success('添加git remote完成', gitRemotePath)
      // 是否有代码未提交
      await this.checkNotCommit()
      // 检查对应远程分支是否存在
      const tags = await this.git.listRemote(['--refs']);
      if (tags.indexOf('refs/heads/master') >= 0) {
        await this.pullRemoteRepo('master',{'--allow-unrelated-histories': null})
      } else {
        await this.pushRemoteRepo('master')
      }
    }
  }
  //步骤三 自动提交代码
  async commit () {
    // 获取正确的版本号
    await this.getCorrectVersion()
    // stash检查
    await this.checkStash()
    // 冲突检查
    await this.checkConflict()
    // 自动提交未提交代码
    await this.checkNotCommit()
    // 开发分支自动切换
    await this.checkoutBranch()
    // 合并远程分支
    await this.pullRemoteMasterAndBranch()
    // 推送分支到远程
    await this.pushRemoteRepo(this.branch)
  }
  // 步骤四 发布代码
  async publish () {
    await this.checkTag()
  }

  // 检查tag
  async checkTag () {
    log.info('获取远程tag列表')
    const tag = `release/${this.version}`
    // 远程tag
    const tagsRemote =await this.getBranchList('release')
    if (tagsRemote.includes(this.version)) {
      log.info('远程tag已存在', tag)
      await this.git.push(['origin', `:refs/tags/${tag}`])
      log.success('远程tag已删除',tag)
    }
    // 本地tag
    const tagsLocal = this.git.tags()
    if ((await tagsLocal).all.includes(tag)) {
      log.info('本地tag已存在', tag)
      await this.git.tag(['-d', tag])
      log.success('本地tag已删除',tag)
    }
    await this.git.addTag(tag)
    log.success('本地tag创建成功', tag)
    await this.git.pushTags('origin')
    log.success('远程tag推送成功', tag)
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
  // 获取版本号
  async getCorrectVersion () {
    log.info('获取代码分支')
    const listBranch = await this.getBranchList('release')
    let releaseVersion
    if (listBranch?.length > 0) {
      releaseVersion = listBranch[0]
    }
    const devVersion = this.version
    if (!releaseVersion) {
      this.branch = `dev/${devVersion}`
    } else if (semver.gte(devVersion,releaseVersion)) { 
      log.info(`当前版本号大于线上版本号，${devVersion} >= ${releaseVersion}`)
      this.branch = `dev/${devVersion}`
    } else {
      log.info(`当前版本号小于线上版本号，${devVersion} < ${releaseVersion}`)
      const incType = await makeList({
        message: '自动升级版本，请选择升级版本类型：',
        choices: [
          {name:`小版本（${releaseVersion} ->${semver.inc(releaseVersion,'patch')}）`,value:'patch'},
          {name:`中版本（${releaseVersion} ->${semver.inc(releaseVersion,'minor')}）`,value:'minor'},
          {name:`大版本（${releaseVersion} ->${semver.inc(releaseVersion,'major')}）`,value:'major'},
        ]
      })
      const incVersion = semver.inc(releaseVersion, incType)
      this.branch = `dev/${incVersion}`
      this.version = incVersion
      this.changeVersionPkg()
      log.verbose('incType',incType)
    }
    log.info('获取代码分支获取成功')
  }
  // 更改package.json版本
  changeVersionPkg () {
    // 获取pkg.name
    const cwd = process.cwd()
    const pkgPath = path.resolve(cwd, 'package.json')
    const pkg = fse.readJSONSync(pkgPath)
    if (pkg?.version !== this.version) {
      pkg.version = this.version
      fse.writeJSONSync(pkgPath,pkg,{spaces:2})
    }
  }
  // 获取分支列表
  async getBranchList (type) {
    const listRemotes = await this.git.listRemote(['--refs'])
    let reg
    if (type === 'release') {
      reg=/.+?refs\/tags\/release\/(\d+\.\d+\.\d+)/g
    } else {
      reg=/.+?refs\/tags\/dev\/(\d+\.\d+\.\d+)/g
    }
    return listRemotes.split('\n').map(remote => {
      const match = reg.exec(remote)
      reg.lastIndex = 0
      if (match && semver.valid(match[1])) {
        return match[1]
      }
    }).filter(_ => _).sort((a, b) => {
      if (semver.lte(b, a)) {
        if (a === b) return 0
        return -1
      }
      return 1
    })
  }
  // 检查stach区
  async checkStash () {
    log.info('stash区检查')
    const stashList =await this.git.stashList()
    if (stashList?.all?.length > 0) {
      await this.git.stash(['pop'])
    }
    log.success('stash区pop完成')
  }
  // 代码冲突检查
  async checkConflict () {
    log.info('代码冲突检查')
    const status = await this.git.status()
    if (status.conflicted.length > 0) {
      throw new Error('当前代码存在冲突，请解决冲突后再试！')
    }
    log.success('代码冲突检查成功')
  }
  // 开发分支自动切换
  async checkoutBranch () {
    const localBranch = await this.git.branchLocal()
    if (localBranch.all.indexOf(this.branch) > -1) {
      await this.git.checkout(this.branch)
    } else {
      await this.git.checkoutLocalBranch(this.branch)
    }
  }
  // 合并远程分支
  async pullRemoteMasterAndBranch () {
    log.info(`合并远程master分支->${this.branch}`)
    await this.pullRemoteRepo('master')
    log.success('合并远程master分支成功')
    log.info('检查远程分支')
    const remoteBranchList = await this.getBranchList()
    if (remoteBranchList.indexOf(this.version) > -1) {
      log.info(`合并${this.branch}->${this.branch}`)
      await this.pullRemoteRepo(this.branch)
      log.success(`合并远程分支${this.branch}成功`)
      await this.checkConflict()
    } else {
      log.success(`不存在${this.branch}远程分支`)
    }
  }
  async pullRemoteRepo (branch,options) {
    // 拉去远程分支
    await this.git.pull('origin', branch,options).catch(err => {
      if (err.message.indexOf('Couldn\'t find remote ref'+branch) > -1) {
        log.warn('拉去远程[master]分支失败')
      }
      process.exit(0)
    })
  }
}


function Commit (instance) {
  return new commitCommand(instance)
}
export default Commit