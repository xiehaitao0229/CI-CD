const shelljs = require('shelljs');
const Rsync = require('rsync');
const path = require('path');
const colors = require('colors');
const argv = require('yargs').argv;

function sendNotify(message) {
  shelljs.exec(`curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c0976265-fd41-4ce3-b15c-55e619731170' \-H 'Content-Type: application/json' \-d '{"msgtype": "text","text": {"content": "${message}"}}'`);
}
//  通知 开始构建

//  安装依赖
sendNotify('安装依赖');
console.log(colors.yellow('🐛 安装依赖'));
if (shelljs.exec("npm i").code !== 0) {
  shelljs.echo("error:npm install error");
  shelljs.exit(1);
}

//  测试
sendNotify('开始进行测试');
console.log(colors.yellow('🐛 进行测试'));
if (shelljs.exec("npm run test").code !== 0) {
  shelljs.echo("error:npm run test error");
  shelljs.exit(1);
}

//  构建
sendNotify('开始构建');
console.log(colors.yellow('🐛 开始构建'));
if (shelljs.exec("npm run build").code !== 0) {
  shelljs.echo("error:npm run build error");
  shelljs.exit(1);
}

//  部署
sendNotify('开始部署');
console.log(colors.yellow('🐛 开始部署'));
const rsync = Rsync.build({
  source: path.join(__dirname, '../', '.vuepress/dist/*'),
  destination: 'root@58.87.69.242:/root/docs',
  flags: 'avz',
  shell: 'ssh',
})

rsync.execute((err,code,cmd)=>{
  console.log(err, code, cmd);
  if(code==0){
    console.log(colors.green('🚀 部署完成'));
    sendNotify('部署完成');
  }else{
    console.log(colors.red('🚀 部署失败'));
    shelljs.exit(1);
  }

})
