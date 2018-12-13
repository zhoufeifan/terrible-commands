const inquirer = require('inquirer');
const ora = require('ora');
const {getCurrentBranchName, checkBranchIsClean, checkBranchExist, exec, success} = require('./utils.js');
const publishOnPlatform = require('./publishOnPlatform.js')

module.exports = async function () {
  checkBranchIsClean()
  // 本地不存在该分支，就拉取一遍远程的
  if(!checkBranchExist('pre-release')){
    exec('git fetch')
  }
  let {versionList} = await inquirer.prompt({
    type: 'checkbox',
    name: 'versionList',
    message: '请选择要发布的测试版本',
    choices:[{name: '测试N版', value: 'n'},{name: '测试D版', value: 'ding'}],
    validate: (checked)=>{
      return checked.length ? true : '请选择要发布的版本'
    }
  })
  let targetBranch = getCurrentBranchName()
  exec('git checkout pre-release; git pull')
  if (targetBranch !== 'pre-release') {
    exec(`git merge --no-edit ${targetBranch}`)
  }
  exec("git push")
  versionList.forEach(item => {
    const command = `npm run test${item === 'ding' ? '-ding' : ''}`
    exec(command);
  });
  exec(`git checkout ${targetBranch}`)
  success(`发布${versionList.join(',')}版代码打包成功`)
  const spinner = ora('发布系统发布中...').start();
  await publishOnPlatform('test')
  spinner.stop();
  // success(`发布${versionList.join(',')}版测试成功`)
};