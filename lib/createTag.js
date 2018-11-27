const inquirer = require('inquirer');

const {checkBranchIsClean, getCurrentBranchName, exec, success} = require('./utils.js');

module.exports = async function() {
  let currentName = getCurrentBranchName();
  if(currentName !=="develop"){
    warn("请在develop分支上操作")
    process.exit(1);
  }
  checkBranchIsClean();
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
    exec('git pull; git push;');
    exec('git checkout master; git pull; git merge --no-edit develop; git pull; git push')
    exec(`git tag -a v${version} -m "${message}";git push origin --tags`)
    success("创建tag成功")
  }
}

