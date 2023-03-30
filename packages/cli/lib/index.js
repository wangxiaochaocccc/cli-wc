import createCommandInit from '@learnmyself.com/init'
import InstallCommand from '@learnmyself.com/install'
import lintCommand from '@learnmyself.com/lint'
import createCli from './createCli.js'
import './logerror.js'

export default function (arg) {
  const program = createCli()
  createCommandInit(program)
  InstallCommand(program)
  lintCommand(program)
  program.parse(process.argv)
}