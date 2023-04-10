import path from 'node:path'
import {execa} from 'execa'

const Cli = path.join(__dirname,'../bin/cli.mjs')
const bin=()=>(...arg)=>execa(Cli,arg)

// 错误的命令
test('run error command', async () => {
  const { stderr } = await bin()('iii')
  expect(stderr).toContain('未知的命令 iii')
})
// --help
test('should not throw error',async () => {
  let err = null
  try {
    await bin()('--help')
  } catch (e) {
    err=e
  }

  expect(err).toBe(null)
})

// --version
test('show correct version',async () => {
  const { stdout } = await bin()('-V')
  expect(stdout).toContain(require('../package.json').version)
})