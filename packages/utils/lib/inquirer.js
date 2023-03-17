import inquirer from 'inquirer'

function make ({
  choices,
  defaultValue,
  message,
  type='list',
  require = true,
  mask = '*',
  validate,
  pageSize,
  loop
}) {
  const options = {
    name:'name',
    default:defaultValue,
    message,
    type,
    require,
    mask,
    validate,
    pageSize,
    loop
  }
  if (type === 'list') {
    options.choices = choices
  }

  return inquirer.prompt(options).then(answers => answers.name)
}

export default function makeList(params){
  return make({...params})
}