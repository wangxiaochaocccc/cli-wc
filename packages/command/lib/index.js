class Command {
  constructor(instance) {
    if (!instance) {
      throw new Error('command instance must not be null')
    }
    this.program = instance

    const cmd = this.program.command(this.command)
    cmd.description(this.description)
    // 钩子函数
    cmd.hook('preAction', () => {
      this.preAction()
    })
    cmd.hook('postAction', () => {
      this.postAction()
    })
    if (this.options?.length > 0) {
      this.options.forEach(element => {
        cmd.option(...element)
      });
    }
    cmd.action((...params) => {
      this.action(params)
    })
  }

  get command () {
    throw new Error('command must be implements')
  }
  get description () {
    throw new Error('description must be implements')
  }
  get action () {
    throw new Error('action must be implements')
  }
  get options () {
    return []
  }

  postAction () { }
  preAction(){}
}

module.exports=Command