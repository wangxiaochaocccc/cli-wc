import Command from '@learnmyself.com/command'
import { ESLint} from 'eslint'
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
    const eslint = new ESLint({ cwd })
    const rules = await eslint.lintFiles(['**/*.js'])
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(rules)
    console.log(resultText,11);
  }
}

function lint (instance) {
  return new lintCommand(instance)
}

export default lint