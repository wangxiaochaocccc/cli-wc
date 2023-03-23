import Command from '@learnmyself.com/command'
import {github,gitee, log,makeList,getPlatform,makeInput} from '@learnmyself.com/utils'

class initCommand extends Command {
  get command () {
    return 'install'
  }
  get description () {
    return 'install project'
  }
  get options () { }

  async action () {
    await this.generateGitAPI()
    await this.searchGit()
  }
  
  // 选择平台和配置tioken逻辑
  async generateGitAPI () {
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
    this.gitApi = githubApi
    this.platform = platform
  }
  // 搜索逻辑
  async searchGit () {
    // 搜索的参数
    const q = await makeInput({
      message: '请输入搜索的内容',
      validate (val) {
        if (val.length) {
          return true
        }
        return '请输入搜索的内容'
      }
    })
    log.verbose('q参数', q)
    // 搜索的language
    const language = await makeInput({
      message: '请输入搜索的语言',
      validate (val) {
        if (val.length) {
          return true
        }
        return '请输入搜索的语言'
      }
    })
    log.verbose('language', language)
    // 搜索的参数
    this.page = 1
    // 搜索结果相关数据
    let searchResult
    let total
    let list = []
    // 判断平台
    if (this.platform === 'github') {
      const params = {
        q: q + (language ? `+language:${language}` : ''),
        page: this.page,
        per_page: 5,
        sort: 'stars_count',
        order: 'desc',
      }
      log.verbose('params',params)
      // 搜索respositories
      searchResult = await this.gitApi.search(params)
      total = searchResult.total_count
      list = searchResult.items.map(item =>({
        name: `${item.full_name} ---  (${item.description})`,
        value:`${item.full_name}`
      }))
    }
    // 选择要下载的项目
    const keyword = await makeList({
      choices: list,
      message:'请选择要下载的项目'
    })
    log.verbose('keyword：',keyword)
  }
}


function InstallCommand (instance) {
  return new initCommand(instance)
}
export default InstallCommand