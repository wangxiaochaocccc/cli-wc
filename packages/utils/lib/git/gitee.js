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
  search (params) {
    return this.get('/search/repositories',params)
  }
}

export default gitee