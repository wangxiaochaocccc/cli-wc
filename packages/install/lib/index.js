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
    let params
    this.page = 1
    // 判断平台
    if (this.platform === 'github') {
      params = {
        q: q + (language ? `+language:${language}` : ''),
        page: this.page,
        per_page: 10,
        sort: 'stars_count',
        order: 'desc',
      }
    }
    log.verbose('params',params)
    // 搜索respositories
    const searchResult = await this.gitApi.search(params)
    console.log(searchResult,11122);
  }
}


function InstallCommand (instance) {
  return new initCommand(instance)
}
export default InstallCommand