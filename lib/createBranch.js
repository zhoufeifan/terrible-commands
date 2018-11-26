const inquirer = require('inquirer');

const {checkBranchIsClean, exec, success} = require('./utils.js');

async function createBranch() {
    checkBranchIsClean()
    let {branchType} = await inquirer.prompt({
        type: 'list',
        name: 'branchType',
        message: '请选择要创建的分支类型',
        choices:['feature', 'hotfix']
    });
    if(branchType === "feature"){
        exec('git checkout develop')
    }else if(branchType === "hotfix"){
        exec('git checkout master')
    }
    let {branchName} = await inquirer.prompt({
        type:'input',
        name:'branchName',
        message:'请输入分支名称'
    });
    exec(`git pull -ff;git checkout -b ${branchType}-${branchName}`)
    success("创建分支成功")
}

createBranch();