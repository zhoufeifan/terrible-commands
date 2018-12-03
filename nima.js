const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
    userDataDir: '/Users/xieyang/Library/Application Support/Google/Chrome/Profile 1'
  });
  const page = await browser.newPage();
  await page.goto('https://sync.superboss.cc/index.xhtml#/html/publish');
  await page.evaluate(() => alert('nima'));
  // await browser.close();
})();