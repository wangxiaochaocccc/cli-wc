import Command from '@learnmyself.com/command'
import {log} from '@learnmyself.com/utils'
import { ESLint} from 'eslint'
import vueConfig from './eslint/vueConfig.js'
class lintCommand extends Command {
  get command () {
    return 'lint'
  }

  get description () {
    return 'lint project'
  }

  get options () { }

  async action () {
    // eslint
    const cwd = process.cwd()
    const eslint = new ESLint({
      cwd,
      overrideConfig:vueConfig
    })
    const rules = await eslint.lintFiles(['./src/**/*.js','./src/**/*.vue'])
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(rules)
    const ESLintResult = await this.parseESLintResult(resultText)
    log.verbose('ESLintResult',ESLintResult)
  }

  async handleResult (resultText,type) {
    const problems = resultText.match(/([0-9]+) problems/)[0].match(/[0-9]+/)[0]
    const errors = resultText.match(/([0-9]+) errors/)[0].match(/[0-9]+/)[0]
    const warnings = resultText.match(/([0-9]+) warnings/)[0].match(/[0-9]+/)[0]
    switch (type) {
      case 'problems':
        return problems
      case 'errors':
        return errors
      case 'warnings':
        return warnings
      default:
        return null
    }
  }
  async parseESLintResult (resultText) {
    const problems =await this.handleResult(resultText,'problems')
    const errors =await this.handleResult(resultText,'errors')
    const warnings =await this.handleResult(resultText, 'warnings')
    return {
      problems: +problems || 0,
      errors: +errors || 0,
      warnings: +warnings || 0,
    }
  }
}

function lint (instance) {
  return new lintCommand(instance)
}

export default lint