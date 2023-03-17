import Command from "@learnmyself.com/command"

class initCommand extends Command {
  get command () {
    return 'init [name]'
  }
  get description () {
    return 'init project'
  }
  action ([name,opts]) {
    console.log('init',name,opts);
  }
  get options () {
    return [
      ['-f', '是否强制更新', false]
    ]
  }
  preAction () {
    console.log('preAction');
  }
  postAction () {
    console.log('postAction');
  }
}

function Init (instance) {
  return new initCommand(instance)
}

export default Init