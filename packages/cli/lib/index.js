const commander = require('commander')
const createCommandInit = require('@learnmyself.com/init')
const pkg = require('../package.json')
const {log,checkNodeVersion,isDebug} = require('@learnmyself.com/utils')
const {program} =commander


// 检查node版本
const NODE_VERSION_NEEDMIN = '17.0.0'
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

module.exports = function (arg) {
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