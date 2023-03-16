const commander = require('commander')
const createCommandInit = require('@learnmyself.com/init')

const pkg = require('../package.json')

const {program} =commander

module.exports = function (arg) {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d,--debug', '是否开启调试模式', false)
  
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