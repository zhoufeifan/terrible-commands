const inquirer = require('inquirer')
const ora = require('ora');
const {getCurrentBranchName, getBranchList, exec, error, warn, success} = require('./utils.js')

// 清除分支
function deleteBranch(branchName){
  if(branchName.match('remote')){
    const spinner = ora('远程分支删除中...').start();
    branchName = branchName.replace(/^remotes\/origin\/(.+)/, '$1')
    // 删除远程分支
    exec(`git push origin --delete ${branchName}`)
    // 更新本地分支信息
    exec('git remote prune origin')
    spinner.stop();
  } else {
    // 删除本地分支
    exec(`git branch -D ${branchName}`)
  }
}

module.exports = async function () {
  const branchList = getBranchList().filter(item => {
    return !item.match('master') && !item.match('develop')
  })
  // 分离本地分支和远程分支
  warn(`请选择要删除的分支`)
  let { targetBranches } = await inquirer.prompt({
    type: 'checkbox',
    name: 'targetBranches',
    message: '请选择要删除的分支',
    choices: branchList
  })


  const currentBranch = getCurrentBranchName()
  targetBranches.forEach(item => {
    if(currentBranch === item){
      error("不能删除当前所在的分支")
    } else {
      deleteBranch(item)
    }
  })
  success('操作成功')
}