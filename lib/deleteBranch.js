const inquirer = require('inquirer')
const {getCurrentBranchName, getBranchList, exec, error, warn, success} = require('./utils.js')

// 清除分支
function deleteBranch(branchName, deleteRemote){
  // 删除本地分支
  exec(`git branch -D ${branchName}`)
  if(deleteRemote){
    // 删除远程分支
    exec(`git push origin --delete ${branchName}`)
    // 更新本地分支信息
    exec('git remote prune origin')
  }
}

module.exports = async function () {
  const branchList = getBranchList().map(item => {
    return {
      name: item,
      value: item,
      disabled: item === 'master' || item === 'develop' 
    }
  });
  warn(`请选择要删除的分支`)
  let { targetBranches } = await inquirer.prompt({
    type: 'checkbox',
    name: 'targetBranches',
    message: '请选择要删除的分支',
    choices: branchList
  })

  let { deleteRemote } = await inquirer.prompt({
    type: 'confirm',
    name: 'deleteRemote',
    message: '是否要一起删除远程的分支'
  })

  const currentBranch = getCurrentBranchName()
  targetBranches.forEach(item => {
    if(currentBranch === item){
      error("不能删除当前所在的分支")
    } else {
      deleteBranch(item, deleteRemote)
    }
  })
  success('操作成功')
}