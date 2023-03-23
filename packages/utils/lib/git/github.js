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
  searchRepo (params) {
    return this.get('/search/repositories',params)
  }
  searchCode (params) {
    return this.get('/search/code',params)
  }
}

export default github