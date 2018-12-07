const puppeteer = require('puppeteer-core');
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
  // await page.goto('https://www.baidu.com');
  // await page.evaluate(() => alert('nima'));
  const hasLogin = await page.$eval('title', el => {
    const title = el.text
    return title && title !== "二维码登录"
  });
  if(!hasLogin){
    console.log('请先登录')
    await page.evaluate(() => alert('未登录'));
    await browser.close();
  }
  await page.evaluate(() => {
    // const
  });
})();