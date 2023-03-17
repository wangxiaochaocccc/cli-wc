import path from 'path'
import fse from 'fs-extra'
import { program } from 'commander'
import { dirname } from 'dirname-filename-esm'
import { checkNodeVersion } from '@learnmyself.com/utils'
import { log } from '@learnmyself.com/utils'

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
  // 打印命令日志
  program.on('option:debug', function () {
    if (program.opts().debug) {
      log.verbose('debug','launch debug mode')
    }
  })
  // 未知命令处理
  program.on('command:*', function (obj) {
    log.error('未知的命令',obj[0])
  })

  return program
  // program
  //   .command('init [name]')
  //   .description('init project')
  //   .option('-f,--force', '是否轻质更新', false)
  //   .action((name, opts) => {
  //     console.log(name,opts);
  //   })
}