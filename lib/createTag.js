const inquirer = require('inquirer');

const {checkBranchIsClean, getCurrentBranchName, getTagList, exec, success, warn} = require('./utils.js');

module.exports = async function() {
  let currentName = getCurrentBranchName();
  if(currentName !=="master"){
    warn("请在master分支上操作")
    process.exit(1)
  }
  // 获取远程最新的tag
  exec('git pull')
  const tags = getTagList()
  const lastTag = tags.slice(-1)[0]
  checkBranchIsClean();
  if(lastTag){
    warn(`上一个版本的tag为${lastTag.replace(/^v/,'')}`)
  }
  let {version} = await inquirer.prompt({
    type:'input',
    name:'version',
    message:'请输入tag版本号'
  });
  let {message} = await inquirer.prompt({
    type:'input',
    name:'message',
    message:'请输入提交信息'
  });
  let {result} = await inquirer.prompt({
    type:'confirm',
    name:'result',
    message:`版本号为v${version}, 提交信息为:"${message}",是否确认？`
  });
  if(result){
    exec(`git tag -a v${version} -m "${message}";git push origin --tags`)
    success("创建tag成功")
  }
  return {version, message};
}

