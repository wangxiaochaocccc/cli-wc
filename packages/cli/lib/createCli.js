import path from 'path'
import { program } from 'commander'
import { dirname } from 'dirname-filename-esm'
import fse from 'fs-extra'
import { checkNodeVersion } from '@learnmyself.com/utils'

// 读取package.json
const __dirname = dirname(import.meta)
const pkgPath = path.resolve(__dirname, '../package.json')
const pkg = fse.readJSONSync(pkgPath)

// 检查node版本
const NODE_VERSION_NEEDMIN = '14.0.0'
function preAction () {
  checkNodeVersion(NODE_VERSION_NEEDMIN)
}

export default function createCli () {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d,--debug', '是否开启调试模式', false)
    .hook('preAction', preAction)
  return program
  // program
  //   .command('init [name]')
  //   .description('init project')
  //   .option('-f,--force', '是否轻质更新', false)
  //   .action((name, opts) => {
  //     console.log(name,opts);
  //   })
}