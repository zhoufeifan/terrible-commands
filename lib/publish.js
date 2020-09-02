const inquirer = require('inquirer');
const {getCurrentBranchName, checkBranchIsClean, exec, error, success} = require('./utils.js');
const createTag = require('./createTag.js')

module.exports = async function () {
  let currentName = getCurrentBranchName();
  if(currentName !=="release"){
    error("请在release分支上操作")
    process.exit(1);
  }
  // checkBranchIsClean();
  // exec('git pull');
  // exec('git checkout master');
  // exec('git pull;git merge --no-edit release');
  await createTag();
  success(`发布${version}版成功`);
};