import axios from 'axios';
import {gitServer} from './gitServer.js';

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
}

export default gitee