import Command from "@learnmyself.com/command"
import { log } from "@learnmyself.com/utils"
import createTemplate from './createTemplate.js'
import downloadTemplate from './downloadTemplate.js'
import installTemplate from './installTemplate.js'

class initCommand extends Command {
  get command () {
    return 'init [name]'
  }
  get description () {
    return 'init project'
  }
  async action ([name,opts]) {
    log.verbose('init', name, opts);
    //选择项目模版，创建项目信息
    const selectedTemplate = await createTemplate(name, opts)
    // 下载项目模版到缓存目录
    await downloadTemplate(selectedTemplate)
    // 安装项目模板到项目目录
    await installTemplate(selectedTemplate,opts)
  }
  get options () {
    return [
      ['--force', '是否强制更新', false]
    ]
  }
  preAction () {}
  postAction () {}
}

function Init (instance) {
  return new initCommand(instance)
}

export default Init