const puppeteer = require('puppeteer-core')
const notifier = require('node-notifier')
notifier.notify({
  title: '重大提示',
  message: '发布成功'
})
return

// 进入发布界面
function gotoPublishTab(pubType){
  const projectNameMap = {
    test: 'dingtalk-fanqie-web-test',
    ding: 'dingtalk-fanqie-D-node-web',
    n: 'dingtalk-fanqie-web-n'
  }
  const targetPublishName = projectNameMap[pubType]
  const $table = $('#dt_basic')
  const $rows = $table.find("tbody > tr")
  const $targetRow = $rows.filter((_,item)=>{
      const projectName = $(item).find('td:eq(2)').text()
      return projectName === targetPublishName
  })
  const $publishBtn = $targetRow.find('.btn-publish')
  $publishBtn.click()
}

// 执行发布的步骤
async function doPublish(pubType){
  const $btn1 = "查看变更"
  const $btn2 = "生成版本替换"
  const $btn3 = "测试"
  const $btn4 = "正式"
  // 判断目标按钮是否可以点击
  const checkBtnClickAble = ($targetBtn)=>{
    return new Promise((resolve)=>{
      if($targetBtn.attr('disabled')){
        setTimeout( async ()=>{
          await checkBtnClickAble($targetBtn)
          resolve()
        },2000)
      } else {
        resolve()
      }
    })
  }

  const checkFinalPublish = ($container)=>{
    return new Promise((resolve)=>{
      setTimeout(async ()=>{
        const finalText = currentText.text().slice(-10)
        if(finalText.match('结束') && finalText.match('成功')){
           await checkFinalPublish($container)
           resolve()
        } else{
          resolve()
        }
      },5000)
    })
  }

  $btn1.click();
  await checkBtnClickAble($btn2)
  $btn2.click()
  await checkBtnClickAble($btn3)
  $btn3.click()
  const $logContainer = "输出日志"
  await checkFinalPublish($logContainer)

}


(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
    slowMo: 250,
    userDataDir: '/Users/xieyang/Library/Application Support/Google/Chrome/Profile 1'
  });
  const page = await browser.newPage();
  page.setViewport({
    width: 1440,
    height: 900
  })
  await page.goto('https://sync.superboss.cc/index.xhtml#/html/publish');
  // await page.goto('http://www.baidu.com');
  // page.on('dialog', async dialog => {
  //   console.log(dialog.message());
  //   await dialog.dismiss();
  //   await browser.close();
  // });
  // page.evaluate(() => {
  //   if(confirm("你确定提交吗？")){
  //     alert(1)
  //   } else {
  //     alert(2)
  //   }
  // });
  const hasLogin = await page.$eval('title', el => {
    const title = el.text
    return title && title !== "二维码登录"
  });
  if(!hasLogin){
    console.log('请先登录')
    await page.evaluate(() => alert('未登录'));
    await browser.close();
  }
  await page.evaluate(gotoPublishTab,'test');
  await page.evaluate(doPublish,'test');
  await browser.close();
})();