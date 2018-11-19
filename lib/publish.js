const inquirer = require('inquirer');
const {getCurrentBranchName, checkBranchIsClean, exec, warn, success} = require('./utils.js');

module.exports = async function () {
  let currentName = getCurrentBranchName();
  if(currentName !=="develop"){
    warn("请在develop分支上操作")
    process.exit(1);
  }
  checkBranchIsClean();
  exec('git pull');
  let {targetList} = await inquirer.prompt({
    type: 'checkbox',
    name: 'targetList',
    message: '请选择要发布的版本',
    choices:[{name: 'N版', value: 'n'},{name: 'D版', value: 'ding'}]
  });
  targetList.forEach(v => {
    let targetBranch = v === 'n'? 'n-release' : 'd-release';
    exec(`git checkout ${targetBranch}`);
    exec('git pull; git merge --no-edit develop');
    v === 'n'? exec('npm run n') : exec('npm run ding');
    exec(`git add *; git commit -am "build ${v}";git pull;git push`);
    success(`发布${v}版成功`);
    exec('git checkout develop');
  });
};