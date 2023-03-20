import axios from 'axios'

const service = axios.create({
  baseURL: 'http://127.0.0.1:7001/',
  timeout:3000
})

const onSuccess = (response) => {
  return response.data
}
const onFailed = (e) => {
  return Promise.reject(e)
}

service.interceptors.response.use(onSuccess, onFailed)

export default service