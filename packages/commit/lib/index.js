import Command from '@learnmyself.com/command'
// import { log } from '@learnmyself.com/utils'


class commitCommand extends Command {
  get command () {
    return 'commit'
  }
  get description () {
    return 'commit code'
  }
  get options () { }

  async action () {
   console.log(11111111);
  }
}


function Commit (instance) {
  return new commitCommand(instance)
}
export default Commit