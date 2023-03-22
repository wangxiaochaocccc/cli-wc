import Command from '@learnmyself.com/command'
import {github} from '@learnmyself.com/utils'

class initCommand extends Command {
  get command () {
    return 'install'
  }
  get description () {
    return 'install project'
  }
  async action () {
    const githubApi = new github()
  }
  get options () {}
}

function InstallCommand (instance) {
  return new initCommand(instance)
}
export default InstallCommand