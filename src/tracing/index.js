const puppeteer = require('puppeteer');

const getGoogleScreeeshot = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.tracing.start({ path: 'trace.json' });
  await page.goto('https://www.google.com');
  await page.tracing.stop();

  await browser.close();
};

getGoogleScreeeshot();
