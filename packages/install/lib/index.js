import Command from '@learnmyself.com/command'
import {github,gitee, log,makeList,getPlatform,makeInput} from '@learnmyself.com/utils'

const PREVIOUS_PAGE = '${prev_page}'
const NEXT_PAGE = '${next_page}'
const SEARCH_MODE_REPO = 'search_repo'
const SEARCH_MODE_CODE = 'search_code'
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
  // 搜索模式
  async chooseSearchMode () {
    if (this.platform === 'github') {
      this.mode = await makeList({
        choices: [
          {name:'项目',value:SEARCH_MODE_REPO},
          {name:'源码',value:SEARCH_MODE_CODE}
        ],
        message:'请选择搜索模式：'
      })
    } else {
      this.mode = SEARCH_MODE_REPO
    }
    log.verbose('mode',this.mode)
  }
  // 搜索逻辑
  async searchGit () {
    await this.chooseSearchMode()
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
    this.q = q
    this.language = language
    this.page = 1
    this.per_page = 5
    await this.doSearch()
  }
  async doSearch () {
    // 搜索结果相关数据
    let searchResult
    let total
    let list = []
    // 判断平台
    if (this.platform === 'github') {
      const params = {
        q: this.q + (this.language ? `+language:${this.language}` : ''),
        page: this.page,
        per_page: this.per_page,
        sort: 'stars_count',
        order: 'desc',
      }
      log.verbose('params', params)
      if (this.mode === 'search_repo') {
         // 搜索respositories
        searchResult = await this.gitApi.searchRepo(params)
        list = searchResult.items.map(item =>({
          name: `${item.full_name}`,
          value:`${item.full_name}`
        }))
      } else {
        searchResult = await this.gitApi.searchCode(params)
        console.log(searchResult);
        list = searchResult.items.map(item =>({
          name: `${item.repository.full_name}`,
          value:`${item.repository.full_name}`
        }))
      }
      total = searchResult.total_count
    }
    // 下一页
    if (this.page * this.per_page < total) {
      list.push({
        name: '下一页',
        value:NEXT_PAGE
      })
    }
    // 上一页
    if (this.page > 1) {
      list.unshift({
        name: '上一页',
        value:PREVIOUS_PAGE
      })
    }
    // 选择要下载的项目
    const keyword = await makeList({
      choices: list,
      message:'请选择要下载的项目'
    })
    log.verbose('keyword：', keyword)
    if (keyword === '${next_page}') {
      this.nextPage()
    } else if (keyword === '${prev_page}') {
      this.prevPage()
    } else {
      // 下载逻辑
    }
  }
  // 上一页
  async prevPage () {
    this.page--
    this.doSearch()
  }
  async nextPage () {
    this.page++
    this.doSearch()
  }
}


function InstallCommand (instance) {
  return new initCommand(instance)
}
export default InstallCommand