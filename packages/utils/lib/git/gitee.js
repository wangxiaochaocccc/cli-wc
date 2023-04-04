import axios from 'axios';
import {gitServer} from './gitServer.js';
import log from '../log.js'

const BASE_URL = 'https://gitee.com/api/v5/'
class gitee extends gitServer {
  constructor() {
    super()
    // 请求相关
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout:5000
    })
    this.service.interceptors.response.use(
      reponse => {
        return reponse.data
      },
      error => {
        return Promise.reject(error)
      }
    )
  }
  get (url,params) {
    return this.service({
      url,
      method: 'get',
      params: {
        ...params,
        access_token:this.token
      }
    })
  }
  post (url, data, headers) {
    return this.service({
      url,
      method: 'post',
      data,
      params: {
        access_token:this.token
      },
      headers
    })
  }
  
  searchRepo (params) {
    return this.get('/search/repositories',params)
  }
  // https://gitee.com/api/v5/repos/anji-plus/captcha/tags
  searchTags (fullName) {
    return this.get(`/repos/${fullName}/tags`)
  }
  // 获取下载地址
  getRepoUrl (fullName) {
    return `https://gitee.com/${fullName}.git`
  }
  // 获取用户相关
  getUser () {
    return this.get('/user')
  }
  // 获取组织
  getOrg () {
    return this.get('/user/orgs')
  }
  getRepo (login,name) {
    return this.get(`/repos/${login}/${name}`).catch(()=>null)
  }
  // 创建仓库
  async createRepoFun (name) {
    // 检查仓库是否存在
    const repo = await this.getRepo(this.login, name)
    if (!repo) {
      log.info('仓库不存在，正在创建...')
      if (this.own === 'user') {
        return this.post('/user/repos',{name})
      } else if (this.own === 'orgnization') {
        const url = `orgs/${this.login}/repos`
        return this.post(url,{name})
      }
    } else {
      log.info('仓库已经存在')
      return repo
    }
   
  }
}

export default gitee