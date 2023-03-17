import  semver from 'semver'
import  chalk from 'chalk'

export default function (needVersion) {
  if (!semver.gte(process.version,needVersion)) {
    throw new Error(chalk.red(`wc-cli需要${needVersion}以上版本的Node.js`))
  }
}