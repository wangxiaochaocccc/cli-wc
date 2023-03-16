const semver =require('semver')

module.exports = function (needVersion) {
  if (!semver.gte(process.version,needVersion)) {
    throw new Error(`wc-cli需要${needVersion}以上版本的Node.js`)
  }
}