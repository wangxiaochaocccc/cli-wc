import urlJoin from 'url-join'
import axios from 'axios'
// 获取npm 信息
function getNpmInfo (npmName) {
  const base_url = 'https://registry.npmjs.org/'
  const full_url = urlJoin(base_url, npmName)
  return axios.get(full_url).then((res) => {
    try {
      return res.data
    } catch (err) {
      return Promise.reject(err)
    }
  })
}

export function getNpmLatestVersion (npmName) {
  return getNpmInfo(npmName).then((res) => {
    if (!res['dist-tags'] || !res['dist-tags'].latest) {
      log.error('没有最新的版本号')
      return Promise.reject(new Error('没有最新的版本号'))
    }
    return res['dist-tags'].latest
  })
}