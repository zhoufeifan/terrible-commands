const {getCurrentBranchName, checkBranchIsClean, exec, error, success} = require('./utils.js');
const createTag = require('./createTag.js');
const notice = require('./notice.js');

module.exports = async function () {
  let currentName = getCurrentBranchName();
  if(currentName !=="release"){
    error("请在release分支上操作")
    process.exit(1);
  }
  checkBranchIsClean();
  exec('git pull');
  exec('git push');
  exec('git checkout master');
  exec('git pull;git merge --no-edit release');
  let { project } = await inquirer.prompt({
    type:'list',
    name:'project',
    message:'请选择项目',
    choices:['volvo-world-mini', 'volvo-workspace-pc']
  });
  const version = await createTag();
  success(`发布${version}版成功`);
  notice(version, project);
};