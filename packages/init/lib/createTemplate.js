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
    value:'template-vue3',
    version:'1.0.1'
  },
  {
    name: 'React18项目模版',
    npmName: '@learnmyself.com/template-react18',
    value:'template-react18',
    version:'1.0.1'
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
  const { type = null, template = null } = opts
  let addType
  let addName
  let selectedTemplate
  // 获取创建类型
  if (type) {
    addType = type
  } else {
   addType = await getType()
  }
  log.verbose('addType', addType)

  if (addType === ADD_TYPE_PROJECT) {
    // 获取名称
    if (name) {
      addName=name
    } else {
      addName = await getName()
    }
    log.verbose('addName', addName)
    // 获取项目模板
    if (template) {
      selectedTemplate = ADD_TEMPLATE.find(_ => _.value === template)
      if (!selectedTemplate) {
        throw new Error(`项目模板${template}不存在`)
      }
    } else {
      const addTemplate = await getTemplate()
      selectedTemplate = ADD_TEMPLATE.find(_=>_.value===addTemplate)
    }
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
      type: addType,
      version:latestVersion,
      targetPath
    }
  } else {
    throw new Error(`创建的项目类型${addType}不存在`)
  }
}