const inquirer = require('inquirer');
const {getCurrentBranchName, checkBranchIsClean, checkBranchExist, exec, success} = require('./utils.js');

module.exports = async function () {
  checkBranchIsClean()
  // 本地存在就拉取一遍远程的
  if(!checkBranchExist('p-release')){
    exec('git fetch')
  }
  let {versionList} = await inquirer.prompt({
    type: 'checkbox',
    name: 'versionList',
    message: '请选择要发布的测试版本',
    choices:[{name: '测试N版', value: 'n'},{name: '测试D版', value: 'ding'}]
  })
  let targetBranch = getCurrentBranchName()
  exec('git checkout p-release; git pull')
  if (targetBranch !== 'p-release') {
    exec(`git merge --no-edit ${targetBranch}; git push`)
  }
  versionList.forEach(item => {
    const command = `npm run test${item === 'd' ? '-ding' : ''}`
    exec(command);
  });
  exec(`git checkout ${targetBranch}`)
  success('发布测试成功')
};