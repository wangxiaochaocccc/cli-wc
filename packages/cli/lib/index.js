import  createCommandInit from '@learnmyself.com/init'
import createCli from './createCli.js'
import './logerror.js'

export default function (arg) {
  const program = createCli()
  createCommandInit(program)
  program.parse(process.argv)
}