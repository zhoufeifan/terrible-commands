const inquirer = require('inquirer');
const shell = require('shelljs');
const {gitlabUrl,gitlabToken} = require('../config.json');
const gitlab = require('gitlab')({
    url: gitlabUrl,
    token: gitlabToken
});
// function getGroups() {
//     return new Promise((resolve)=>{
//         gitlab.groups.all(function(groups) {
//             let groupList = groups.map(item=>{
//                 return {name:item.name,value:item.id,};
//             });
//             resolve(groupList)
//         });
//     });
// }

// function getProjectsByGroupId(id) {
//     return new Promise((resolve)=>{
//        gitlab.groups.listProjects(id,(projects)=>{
//            console.log(projects);
//
//            let projectList = projects.map(item=>{
//                return {name:item.name,value:item.id};
//            });
//            resolve(projectList);
//        });
//     });
// }

// async function createHotfix() {
//     let {branchName} = await inquirer.prompt({
//         type: 'list',
//         name: 'groupId',
//         message: '请选择项目所在的group',
//         choices: await getGroups()
//     });
//     let {projectId} = await inquirer.prompt({
//         type:'list',
//         name:'projectId',
//         message:'请选择项目',
//         choices:await getProjectsByGroupId(groupId)
//     });
//     console.log(projectId);
//     let {branch} = await inquirer.prompt({
//         type: 'input',
//         name: 'branch',
//         message: "请输入分支名"
//     });
//     gitlab.projects.init();
//     gitlab.projects.repository.createBranch({projectId,branch:branch||"nima",ref:'master'},(a,b,c)=>{
//         console.log(a,b,c);
//     })
// }

async function createBranch() {
    let {commitMsg} = await inquirer.prompt({
        type: 'input',
        name: 'commitMsg',
        message: '输入提交的信息',
        choices:['feature', 'hotfix']
    });
    console.log(shell.exec(`git add *;git ci -am ${commitMsg};git co master`));
    let {branchType} = await inquirer.prompt({
        type: 'list',
        name: 'branchType',
        message: '输入要创建的分支类型',
        choices:['feature', 'hotfix']
    });
    let {branchName} = await inquirer.prompt({
        type:'input',
        name:'branchName',
        message:'请输入分支名称'
    });
    console.log(branchType,branchName);
    // gitlab.projects.init();
    // gitlab.projects.repository.createBranch({projectId,branch:branch||"nima",ref:'master'},(a,b,c)=>{
    //     console.log(a,b,c);
    // })
}

createBranch();