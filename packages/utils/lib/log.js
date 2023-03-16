const log = require('npmlog')
const isDebug = require('./isDebug')
// debug模式
if (isDebug()) {
  log.level = 'verbose'
} else {
  log.level = 'info'
}

log.heading = 'wc-cli'
// 自定义
log.addLevel('success', 2000, { fg: 'green', bg: 'grey', bold: true })

module.exports=log