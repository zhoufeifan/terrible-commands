const shell = require('shelljs');
const chalk = require('chalk');
//获取当前分支名称
function getCurrentBranchName(){
  const branch = shell.exec('git symbolic-ref --short HEAD', {silent: true}).toString().replace(/\n/g,'');
  return branch;
}

//判断当前分支是否未提交或有文件未添加
function checkBranchIsClean() {
  if (shell.exec('git status --porcelain').stdout.trim()
      || shell.exec("git ls-files --other --exclude-standard --directory | egrep -v '/$'").stdout.trim()
  ) {
      console.log(chalk.red('请先提交当前分支的所有更改'));
      process.exit(1);
  }
}

// 执行shell脚本的封装
function exec(cmd) {
  const result = shell.exec(cmd);
  if (result.code !== 0) {
      shell.exit(1);
  }
  return result;
}

module.exports =  {
  getCurrentBranchName,
  checkBranchIsClean,
  exec
}