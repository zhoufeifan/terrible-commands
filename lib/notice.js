const axios = require('axios');
const color = require('chalk');


module.exports = async function (version, project) {
    axios({
        method: 'post',
        // url: `https://oapi.dingtalk.com/robot/send?access_token=c1abb47d02fda3796b2a99bc041220558f1a169565ce26d2a5c05b8de9477999`,
        url: `https://oapi.dingtalk.com/robot/send?access_token=63678ca6fdec519b6b840b7c7f47c6da38b359785f3035923f7d6aad3aae8596`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            "msgtype": "text",
            "text": {
                "content": `项目：${project}合并master分支完成，tag版本：${version}`
            },
            "at": {
                "atMobiles": [
                ],
                "isAtAll": true
            }
        },
    }).then(() => {
        console.log(color.green('发送成功'));
    }).catch(error=>{
        console.log(color.yellow(error));
    });
};