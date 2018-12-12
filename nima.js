const puppeteer = require('puppeteer-core')
const notifier = require('node-notifier')
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
  const $btns = $('footer>button')
  const $btn1 = $btns[4] // 查看变更
  const $btn2 = $btns[3] // 生成版本替换
  const $btn3 = $btns[2] // 测试环境
  const $btn4 = $btns[0] // 正式环境
  const $publishTab = $('.tab-content > .tab-pane')[2];
  // 判断目标按钮是否可以点击
  const checkBtnClickAble = ($targetBtn)=>{
    return new Promise((resolve)=>{
      if($targetBtn.getAttribute("disabled") === "disabled"){
        setTimeout( async ()=>{
          await checkBtnClickAble($targetBtn)
          resolve()
        },2000)
      } else {
        resolve()
      }
    })
  }

  const checkFinalPublish = (times = 0)=>{
    return new Promise((resolve, reject)=>{
      if(times > 10000){
        reject('发布失败')
        return
      } 
      setTimeout(async ()=>{
        const finalText = $publishTab.innerHTML.slice(-20)
        if(finalText.match('结束') && finalText.match('发布耗时')){
          resolve()
        } else{
          checkFinalPublish(times + 5000)
          .then(resolve)
          .catch(reject)
        }
      },5000)
    })
  }

  $btn1.click();
  await checkBtnClickAble($btn2)
  $btn2.click()
  await checkBtnClickAble($btn3)
  $btn3.click()
  try{
    await checkFinalPublish()
    return null
  } catch (e){
    return e
  }
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

  const hasLogin = await page.$eval('title', el => {
    const title = el.text
    return title && title !== "二维码登录"
  });
  if(!hasLogin){
    console.log('请先登录')
    await page.evaluate(() => alert('未登录'))
    // await browser.close()
    return
  }
  // 监听页面中的 确认发布confirm
  page.on('dialog', async dialog => {
    if(dialog.message().match('确认发布')){
      await dialog.accept()
    } else {
      await dialog.dismiss();
    }
  });
  // 选择发布的项目，进入发布页面
  await page.evaluate(gotoPublishTab,'test')
  // 执行发布的一系列操作
  const error = await page.evaluate(doPublish,'test')
  if(error){
    notifier.notify({
      title: '发布失败',
      message: error,
      wait: true
    })
  } else {
    notifier.notify({
      title: '发布成功',
      wait: true
    })
    // await browser.close()
  }
})();