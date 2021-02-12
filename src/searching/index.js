const puppeteer = require('puppeteer');

const getSearching = async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 250 });
  const page = await browser.newPage();

  await page.goto('https://google.com');

  await page.type('input.gLFyf', 'puppeteer');

  await page.keyboard.press('Enter');

  await page.waitForNavigation();

  const link = await page.$('div.yuRUbf > a');

  await link.click();

  await page.waitForNavigation();

  console.log(page.url());
};

getSearching();
