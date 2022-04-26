const puppeteer = require('puppeteer');
const fs = require('fs');

function splitMulti(str, tokens) {
  var tempChar = tokens[0]; // We can use the first token as a temporary join character
  for (var i = 1; i < tokens.length; i++) {
    str = str.split(tokens[i]).join(tempChar);
  }
  str = str.split(tempChar);
  return str;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 100000
  });
  const page = await browser.newPage();
  const url = 'https://partakefoods.com/';

  await page.goto(url, { waitUntil: 'networkidle2' });
  page.on('dialog', async dialog => {
    await dialog.dismiss();
  });

  // page.setViewport({ width: 760, height: 950, deviceScaleFactor: 1 })
  const fullTitle = await page.title();
  title = splitMulti(fullTitle, ' | ', ' - ')[0];
  const description = await page.$eval("head > meta[name='description']", element => element.content);
  console.log(title, description);

  const [button] = await page.$x("//button[contains(., 'Accept')]");
  if (button) {
    await button.click();
  }

  const newSite = {
    title,
    description
  }

  // fs.writeFileSync('data.json', JSON.stringify(data));
  // fs.appendFile('data.json', JSON.stringify(newSite), (err) => {
  //   if (err) throw err;
  //   console.log('The "data to append" was appended to file!');
  // })

  await page.screenshot({ path: `${title}.png`, fullPage: true });
  await browser.close();
})()