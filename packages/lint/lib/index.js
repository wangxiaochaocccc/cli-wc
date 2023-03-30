import Command from '@learnmyself.com/command'

class lintCommand extends Command {
  get command () {
    return 'lint'
  }

  get description () {
    return 'lint project'
  }

  get options () { }

  action () {
    
  }
}

function lint (instance) {
  return new lintCommand(instance)
}

export default lint