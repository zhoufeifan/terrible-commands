const inquirer = require('inquirer');
const {getCurrentBranchName, checkBranchIsClean, exec, error, success} = require('./utils.js');

module.exports = async function () {
  let currentName = getCurrentBranchName();
  if(currentName !=="pre-release"){
    error("请在pre-release分支上操作")
    process.exit(1);
  }
  checkBranchIsClean();
  exec('git pull; git push');
  exec('git checkout develop')
  exec('git pull; git merge --no-edit pre-release');
  exec('git push');
  let {version} = await inquirer.prompt({
    type: 'list',
    name: 'version',
    message: '请选择要发布的版本',
    choices:[{name: 'N版', value: 'n'},{name: 'D版', value: 'ding'}]
  });
  let targetBranch = version === 'n'? 'n-release' : 'd-release';
  exec(`git checkout ${targetBranch}`);
  // 撤销本地dist文件的更改，避免冲突
  exec('git reset --hard')
  exec('git pull; git merge --no-edit develop');
  version === 'n'? exec('npm run n') : exec('npm run ding');
  exec(`git add *; git commit -am "build ${version}";git pull;git push`);
  success(`发布${version}版成功`);
  exec('git checkout develop');
};