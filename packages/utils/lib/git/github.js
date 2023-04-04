import axios from 'axios';
import {gitServer} from './gitServer.js';

const BASE_URL = 'https://api.github.com/'
class github extends gitServer {
  constructor() {
    super()
    // 请求相关
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout:5000
    })
    this.service.interceptors.request.use(
     config => {
        config.headers['Authorization'] = `Bearer ${this.token}`
        config.headers['Accept'] = 'application/vnd.github+json'
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
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
      params
    })
  }

  post (url,data,headers) {
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
  searchCode (params) {
    return this.get('/search/code',params)
  }
  searchTags (full_name,params) {
    return this.get(`repos/${full_name}/tags`,params)
  }
   // 获取下载地址
   getRepoUrl (fullName) {
    return `https://github.com/${fullName}.git`
   }
  // 获取用户相关
  getUser () {
    return this.get('/user')
  }
  // 获取组织
  getOrg () {
    return this.get('/user/orgs')
  }
  // 创建仓库
  createRepoFun (name) {
    if (this.own === 'user') {
      return this.post('/user/repos', { name }, {
        Accept:'application/vnd.github+json'
      })
    } else if (this.own === 'orgnization') {
      const url = `orgs/${this.login}/repos`
      return this.post(url,{name})
    }
  }
}

export default github