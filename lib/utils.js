const shell = require('shelljs');
const chalk = require('chalk');
//获取当前分支名称
function getCurrentBranchName(){
  const branch = shell.exec('git symbolic-ref --short HEAD', {silent: true}).toString().replace(/\n/g,'');
  return branch;
}

// 判断当前分支是否未提交或有文件未添加
function checkBranchIsClean() {
  if (shell.exec('git status --porcelain').stdout.trim()
      || shell.exec("git ls-files --other --exclude-standard --directory | egrep -v '/$'").stdout.trim()
  ) {
      console.log(chalk.red('请先提交当前分支的所有更改'));
      process.exit(1);
  }
}

// 检测本地是否存在某一分支

function checkBranchExist(branchName){
  return shell.exec(`git branch -a`, {silent: true}).toString().includes(branchName)
}

function getBranchList(){
  const arr = shell.exec(`git branch -a`, {silent: true}).toString().split(/\n/)
  // .filter(item =>{
  //   return !!item && !item.match('HEAD');
  // })
  // .map(item =>{
  //   let result = item.replace(/^\*/,'').trim()
  //   if(result.match('remote')){
  //     result = result.replace(/^remotes\/origin\/(.+)/, '$1')
  //   }
  //   return result
  // })
  // return [...new Set(arr)]
  const result = []
  arr.forEach(item=> {
    if(item && !item.match('HEAD')) {
      result.push(item.replace(/^\*/,'').trim())
    }
  })
  return result
}

// 执行shell脚本的封装
function exec(cmd) {
  const result = shell.exec(cmd);
  if (result.code !== 0) {
      shell.exit(1);
  }
  return result;
}

//错误提示
function error(msg){
  console.log(chalk.red(msg));
}

// 警告提示
function warn(msg){
  console.log(chalk.yellow(msg));
}

//成功提示
function success(msg){
  console.log(chalk.green(msg));
}

module.exports =  {
  getCurrentBranchName,
  checkBranchIsClean,
  checkBranchExist,
  getBranchList,
  exec,
  warn,
  error,
  success
}