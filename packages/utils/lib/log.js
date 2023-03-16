const log = require('npmlog')

// debug模式
if (process.argv.includes('--debug') || process.argv.includes('-d')) {
  log.level = 'verbose'
} else {
  log.level = 'info'
}

log.heading = 'wc-cli'
// 自定义
log.addLevel('success', 2000, { fg: 'green', bg: 'grey', bold: true })

module.exports=log