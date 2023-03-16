#!/usr/bin/env node
"use strict";

var importLocal = require('import-local');

var entry = require('../lib/index');

var log = require('npmlog');

if (importLocal(__filename)) {
  log.info('cli', '使用本地wc-cli版本');
} else {
  entry(process.argv.slice(2));
}