import Command from "@learnmyself.com/command"
import { log } from "@learnmyself.com/utils"
import createTemplate from './createTemplate.js'

class initCommand extends Command {
  get command () {
    return 'init [name]'
  }
  get description () {
    return 'init project'
  }
  action ([name,opts]) {
    log.verbose('init', name, opts);
    //创建项目模版
    createTemplate(name,opts)
  }
  get options () {
    return [
      ['-f', '是否强制更新', false]
    ]
  }
  preAction () {}
  postAction () {}
}

function Init (instance) {
  return new initCommand(instance)
}

export default Init