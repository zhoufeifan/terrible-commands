const program = require('commander');

program
    .version(require('./package').version)
    .usage('<command> [options]')
    .command('branch', '拉取新的daily分支')
    .command('daily', '发布资源到日常')
    .command('online', '发布资源到线上')
    .command('img', '上传图片')
    .command('delimg', '删除图片')
    .command('server', '重启服务器vm')
    .command('proxy', '开启代理')
    .command('link', '创建代理链接')
    .command('unlink', '删除代理链接')
    .parse(process.argv);