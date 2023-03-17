import path from 'path'
import { program } from 'commander'
import  createCommandInit from '@learnmyself.com/init'
import  {log,checkNodeVersion,isDebug} from '@learnmyself.com/utils'
import { dirname } from 'dirname-filename-esm'
import fse from 'fs-extra'

// 读取package.json
const __dirname = dirname(import.meta)
const pkgPath = path.resolve(__dirname, '../package.json')
const pkg = fse.readJSONSync(pkgPath)

// 检查node版本
const NODE_VERSION_NEEDMIN = '14.0.0'
function preAction () {
  checkNodeVersion(NODE_VERSION_NEEDMIN)
}

// 错误处理
process.on('uncaughtException', (e) => {
  if (isDebug()) {
    console.log(e);
  } else {
    console.log(e.message)
  }
})

export default function (arg) {
  log.verbose('11111')
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d,--debug', '是否开启调试模式', false)
    .hook('preAction',preAction)
  // program
  //   .command('init [name]')
  //   .description('init project')
  //   .option('-f,--force', '是否轻质更新', false)
  //   .action((name, opts) => {
  //     console.log(name,opts);
  //   })
  createCommandInit(program)

  program.parse(process.argv)
}