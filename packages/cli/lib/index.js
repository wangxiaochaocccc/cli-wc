import  createCommandInit from '@learnmyself.com/init'
import  {log,isDebug} from '@learnmyself.com/utils'
import createCli from './createCli.js'

// 错误处理
process.on('uncaughtException', (e) => {
  if (isDebug()) {
   log.error(e)
  } else {
    log.error(e.message)
  }
})

export default function (arg) {
  const program = createCli()
  createCommandInit(program)
  program.parse(process.argv)
}