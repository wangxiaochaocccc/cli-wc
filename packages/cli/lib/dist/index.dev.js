"use strict";

var commander = require('commander');

var pkg = require('../package.json');

var program = commander.program;

module.exports = function (arg) {
  program.name(Object.keys(pkg.bin)[0]).usage('<command> [options]').version(pkg.version).option('-d,--debug', '是否开启调试模式', false);
  program.parse(process.argv);
};