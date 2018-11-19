const chalk = require('chalk');

const {getCurrentBranchName, checkBranchIsClean, exec} = require('./utils.js');

module.exports = async function () {
  let currentName = getCurrentBranchName();
  if(currentName !=="develop"){
    console.log(chalk.red('请在develop分支上操作'));
    process.exit(1);
  }
  checkBranchIsClean();
  exec('git pull');
  let {tragetType} = await inquirer.prompt({
    type: 'checkbox',
    name: 'tragetType',
    message: '请选择要发布的版本',
    choices:['N版', 'D版']
});
};