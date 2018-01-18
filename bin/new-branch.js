const inquirer = require('inquirer');
const shell = require('shelljs');

async function createBranch() {
    let {commitMsg} = await inquirer.prompt({
        type: 'input',
        name: 'commitMsg',
        message: '输入提交的信息',
        choices:['feature', 'hotfix']
    });
    shell.exec(`git add *;git commit -am ${commitMsg}`);
    let {branchType} = await inquirer.prompt({
        type: 'list',
        name: 'branchType',
        message: '输入要创建的分支类型',
        choices:['feature', 'hotfix']
    });
    if(branchType === "feature"){
        shell.exec('git checkout develop');
    }else if(branchType === "hotfix"){
        shell.exec('git checkout master');
    }
    let {branchName} = await inquirer.prompt({
        type:'input',
        name:'branchName',
        message:'请输入分支名称'
    });
    shell.exec(`git pull -ff;git checkout -b ${branchType}/${branchName}`)
}

createBranch();