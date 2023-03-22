import path from 'node:path'
import fse from 'fs-extra'
import  {homedir} from 'node:os'
import { pathExistsSync } from 'path-exists'
import { makePassword } from '../inquirer.js'

const TEMP_DIR = '.wc-cli'
const TOKEN_PATH = '.token'

// 获取token地址
function getTokenPath () {
  return path.resolve(homedir(),TEMP_DIR,TOKEN_PATH)
}
class gitServer {
  constructor() {
    // 判断是否有token
    const tokenPath = getTokenPath()
    if (pathExistsSync(tokenPath)) {
      this.token = fse.readFileSync(tokenPath)
    } else {
      this.getToken().then(token => {
        this.token = token
      })
    }
  }
  getToken () {
    return makePassword({
      message:'请填写token信息'
    })
  }
}

export default gitServer