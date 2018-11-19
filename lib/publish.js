const chalk = require('chalk');
const inquirer = require('inquirer');
const {getCurrentBranchName, checkBranchIsClean, exec} = require('./utils.js');

module.exports = async function () {
  let currentName = getCurrentBranchName();
  if(currentName !="develop"){
    console.log(chalk.red('请在develop分支上操作'));
    process.exit(1);
  }
  // checkBranchIsClean();
  // exec('git pull');
  let {targetType} = await inquirer.prompt({
    type: 'checkbox',
    name: 'targetType',
    message: '请选择要发布的版本',
    choices:['N版', 'D版']
  });
  console.log(targetType);
};