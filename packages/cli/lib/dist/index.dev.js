"use strict";

var commander = require('commander');

var pkg = require('../package.json');

var program = commander.program;

module.exports = function (arg) {
  program.name(Object.keys(pkg.bin)[0]).usage('<command> [options]').version(pkg.version).option('-d,--debug', '是否开启调试模式', false);
  program.command('init [name]').description('init project').option('-f,--force', '是否轻质更新', false).action(function (name, opts) {
    console.log(name, opts);
  });
  program.parse(process.argv);
};