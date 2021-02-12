const puppeteer = require('puppeteer');
const fs = require('fs');

const scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.goto('http://books.toscrape.com');

  await page.waitForSelector('.page_inner');

  let urls = await page.$$eval('section ol > li', (elems) => {
    const elemsInStock = elems.filter(
      (elem) =>
        elem.querySelector('.instock.availability > i').textContent !==
        'In stock'
    );

    return elemsInStock.map((el) => el.querySelector('h3 > a').href);
  });

  console.log(urls);

  const getBookData = (url) =>
    new Promise(async (res, rej) => {
      const data = {};

      const page = await browser.newPage();

      await page.goto(url);

      data.title = await page.$eval(
        '.product_main > h1',
        (text) => text.textContent
      );

      data.price = await page.$eval('.price_color', (text) =>
        Number(text.textContent.match(/\d+/)[0])
      );

      data.avaliable = await page.$eval('.instock.availability', (text) =>
        Number(text.textContent.match(/\d+/)[0])
      );

      data.img = await page.$eval('#product_gallery img', (img) => img.src);

      data.description = await page.$eval(
        '#product_description',
        (div) => div.nextSibling.nextSibling.textContent
      );

      data.upc = await page.$eval(
        '.table.table-striped > tbody > tr > td',
        (table) => table.textContent
      );

      res(data);

      await page.close();
    });

  const books = [];

  for (const url of urls) {
    const book = await getBookData(url);
    books.push(book);
    console.log(book);
  }

  fs.writeFile('books.json', JSON.stringify(books), 'utf8', (err) => {
    if (err) throw new Error(err.message);
  });
};

scrape();
