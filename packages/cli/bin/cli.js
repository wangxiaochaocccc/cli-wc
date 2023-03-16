#!/usr/bin/env node

const importLocal = require('import-local')
const entry = require('../lib/index')
const log = require('npmlog')


if (importLocal(__filename)) {
  log.info('cli','使用本地wc-cli版本')
} else {
  entry(process.argv.slice(2))
}