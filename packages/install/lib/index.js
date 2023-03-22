import Command from '@learnmyself.com/command'


class initCommand extends Command {
  get command () {
    return 'install'
  }
  get description () {
    return 'install project'
  }
  async action (params) {
    console.log(params);
  }
  get options () {}
}

function InstallCommand (instance) {
  return new initCommand(instance)
}
export default InstallCommand