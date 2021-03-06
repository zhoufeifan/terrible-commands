const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer-core')
const notifier = require('node-notifier')
const inquirer = require('inquirer');
const ora = require('ora');
const { dateTimeFormat, warn } = require('./utils.js')

const userHome = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']

const configPath = path.join(userHome, '.fq/config.json')
// 进入发布界面
function gotoPublishTab(pubType){
  const projectNameMap = {
    test: 'dingtalk-fanqie-web-test',
    ding: 'dingtalk-fanqie-D-node-web',
    n: 'dingtalk-fanqie-web-n',
    edu: 'ding-fq-edu-web'
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
  $('html, body').animate({
    scrollTop: $(".jarviswidget").offset() ? $(".jarviswidget").offset().top : 600
  }, 500);
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
      if(times > 60000){
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
  if(pubType === 'test' || pubType === 'edu-test'){
    await checkBtnClickAble($btn3)
    $btn3.click()
  } else {
    await checkBtnClickAble($btn4)
    $btn4.click()
  }

  try{
    await checkFinalPublish()
    return null
  } catch (e){
    return e
  }
}

// 获取发布码信息
function getPublishCode(type){
  if (!fs.existsSync(configPath)) {
    return {
      success: false,
      message: '请输入发布码'
    }
  } else {
    config = JSON.parse(fs.readFileSync(configPath))
    const { code, date } = config[type]
    if(date !== dateTimeFormat()){
      return {
        success: false,
        message: '发布码过期，请重新输入'
      }
    }
    return {
      success: true,
      code
    }
  }
}

// 保存发布码
function savePublishCode(type, code){
  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(path.join(userHome, '.fq'))
    fs.writeFileSync(configPath, '{}')
  }
  const config  = JSON.parse(fs.readFileSync(configPath))
  config[type] = {
    code,
    date: dateTimeFormat(new Date())
  }
  fs.writeFileSync(configPath, JSON.stringify(config))
}

function sleep(time){
  return new Promise ((resolve)=>{
    setTimeout(()=>{
      resolve()
    }, time)
  })
}

module.exports = async (publishType = 'test') => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
    slowMo: 250,
    // devtools: true,
    userDataDir: `${userHome}/Library/Application Support/Google/Chrome/Profile 1`
  });
  const page = await browser.newPage();
  page.setViewport({
    width: 1440,
    height: 900
  })

  await page.goto('https://sync.superboss.cc/index.xhtml#/html/publish')
  const title = await page.title()
  if(title === '二维码登录') {
    notifier.notify({
      title: '提示',
      message: `请先钉钉扫码登录发布系统`,
      timeout: 10
    })
    // 等待用户扫码登录
    await page.waitForNavigation({timeout: 0})
    await page.goto('https://sync.superboss.cc/index.xhtml#/html/publish')
  }
  // 需要等待页面加载完
  await sleep(2000)
  const spinner = ora('发布系统发布中...').start();
  // 监听页面中的 确认发布confirm
  page.on('dialog', async dialog => {
    if(dialog.message().match('确认发布')){
      await dialog.accept()
    } else {
      await dialog.dismiss();
    }
  });
  // 选择发布的项目，进入发布页面
  await page.evaluate(gotoPublishTab, publishType)
  const pubCodeInput = await page.$("input[name='publishCode']")
  try{
    if(pubCodeInput){
      const result = getPublishCode(publishType)
      if(result.success){
        pubCodeInput.type(result.code)
      } else {
        warn(result.message)
        const { pubCode } = await inquirer.prompt({
         type: 'input',
         name: 'pubCode',
         message: '请输入发布码',
         validate: (code)=>{
           return code ? true : '请输入发布码'
         }
       });
       savePublishCode(publishType, pubCode)
       pubCodeInput.type(pubCode)
      }
   }
  }catch(e){
    console.log(e)
    await browser.close()
    return
  }

  // 执行发布的一系列操作
  const error = await page.evaluate(doPublish, publishType)
  if(error){
    notifier.notify({
      title: '发布失败',
      message: error,
      wait: true
    })
  } else {
    notifier.notify({
      title: '发布成功',
      message: `番茄${publishType}版`,
      wait: true
    })
    spinner.stop();
    await browser.close()
  }
}