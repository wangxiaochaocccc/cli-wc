import { homedir } from 'node:os'
import path from 'node:path'
import { log, makeList, makeInput, getNpmLatestVersion } from "@learnmyself.com/utils"

const ADD_TYPE_PROJECT = 'project'
const ADD_TYPE_PAGE = 'page'
const TEMP_DIR='.wc-cli'
const ADD_TEMPLATE = [
  {
    name: 'Vue3项目模版',
    npmName: '@learnmyself.com/template-vue3',
    version:'1.0.0'
  },
  {
    name: 'React18项目模版',
    npmName: '@learnmyself.com/template-react18',
    version:'1.0.0'
  }
]
const ADD_TYPE = [
  {
    name: '项目',
    value:ADD_TYPE_PROJECT
  },
  {
    name: '页面',
    value: ADD_TYPE_PAGE
  },
]

// 获取创建类型
function getType () {
  return makeList({
    choices: ADD_TYPE,
    message: '请选择初始化类型',
    defaultValue:ADD_TYPE_PROJECT
  })
}

// 获取项目类型
function getName () {
  return makeInput({
    message: '请输入项目名称：',
    default: '',
    validate (val) {
      if (val.length) {
        return true
      }
      return '项目名称必填'
    }
  })
}
// 获取项目模板
function getTemplate () {
  return makeList({
    choices: ADD_TEMPLATE,
    message: '请选择项目模板'
  })
}
function getTargetPath () {
  return path.resolve(`${homedir()}/${TEMP_DIR}`,'addTemplate')
}

export default async function createTemplate (name, opts) {
  // 获取创建类型
  const addType = await getType()
  log.verbose('addType', addType)
  if (addType === ADD_TYPE_PROJECT) {
    const addName = await getName()
    log.verbose('addName', addName)
    const addTemplate = await getTemplate()
    const selectedTemplate = ADD_TEMPLATE.find(_=>_.name===addTemplate)
    log.verbose('addTemplate', selectedTemplate)
    // 获取最新版本号
    const latestVersion = await getNpmLatestVersion(selectedTemplate.npmName)
    log.verbose('latestVersion', latestVersion)
    // 获取缓存路径
    const targetPath = getTargetPath()
    
    // 返回
    return {
      template: selectedTemplate,
      name: addName,
      tyep: addType,
      version:latestVersion,
      targetPath
    }
  }
}