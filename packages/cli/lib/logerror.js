import  {log,isDebug} from '@learnmyself.com/utils'


function printLog (e,type) {
  if (isDebug()) {
    log.error(type,e)
   } else {
     log.error(type,e.message)
   }
}
// 错误处理
process.on('uncaughtException', (e) =>printLog(e,'error') )

process.on('unhandledRejection', (e) => printLog(e,'promise'))