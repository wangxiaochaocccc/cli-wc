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
    await this.getTags()
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
  // 选择tags逻辑
  async getTags () {
    this.tagePage = 1
    this.tagPerPage = 5
    await this.doSearchTags()
  }
  async doSearchTags () {
    let params = {
      page: this.tagePage,
      per_page:this.tagPerPage
    }
    let tagsResult
    let tagsChoices = []
    if (this.platform === 'github') {
      tagsResult = await this.gitApi.searchTags(this.keyword, params)
      log.verbose('tagsResult',tagsResult)
      tagsChoices = tagsResult.map(item => ({
        name: item.name,
        value: item.name
      }))
    } else {
      tagsResult = await this.gitApi.searchTags(this.keyword)
      log.verbose('tagsResult',tagsResult)
      tagsChoices = tagsResult.map(item => ({
        name: item.name,
        value: item.name
      }))
    }
    // 选择tags
    if (tagsResult.length > 0) {
      // 翻页相关
      if (this.tagePage > 1) {
        tagsChoices.unshift({
          name: '上一页',
          value:PREVIOUS_PAGE
        })
      }
      tagsChoices.push({
        name: '下一页',
        value:NEXT_PAGE
      })
      
      const selectedTags = await makeList({
        message: '请选择tags',
        choices:tagsChoices
      })
      log.verbose('selectedTags', selectedTags)

      if (selectedTags === '${prev_page}') {
        this.prevTagPage()
      } else if (selectedTags === '${next_page}') {
        this.nextTagPage()
      }
    } else {
      log.warn('未找到相关tags')
    }
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
        list = searchResult.items.map(item =>({
          name: `${item.repository.full_name}`,
          value:`${item.repository.full_name}`
        }))
      }
      total = searchResult.total_count
    } else {
      const params = {
        q: this.q,
        page: this.page,
        per_page: this.per_page,
        sort: 'stars_count',
        order: 'desc',
      }
      if (this.language) {
        params.language = this.language
      }
      total = 99999 //gitee没有返回total，所以给个默认值
      searchResult = await this.gitApi.searchRepo(params)
      list = searchResult.map(item =>({
          name: `${item.full_name}`,
          value:`${item.full_name}`
      }))
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
    if (total > 0) {
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
        this.keyword = keyword
        // 下载逻辑
      } 
    } else {
      log.success('未找到您想要的结果')
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
  nextTagPage () {
    this.tagePage++
    this.doSearchTags()
  }
  prevTagPage () {
    this.tagePage--
    this.doSearchTags()
  }
}


function InstallCommand (instance) {
  return new initCommand(instance)
}
export default InstallCommand