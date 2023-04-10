#!/usr/bin/env node

import importLocal from 'import-local'
import entry from '../lib/index.js'
import { log } from '@learnmyself.com/utils'
import { filename } from 'dirname-filename-esm'

const __filename = filename(import.meta)

if (importLocal(__filename)) {
  log.info('cli','使用本地wc-cli版本')
} else {
  entry(process.argv.slice(2))
}