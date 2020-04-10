const puppeteer = require('puppeteer');
const dotenv = require('dotenv')
dotenv.config();

const crawler = async () => {
  try {
    let islogin = false;
    const browser = await puppeteer.launch({ headless: false, args: ['--window-size=1920,1080'] });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080
    });
    await page.goto('http://tcafe2a.com/');
    // const id = process.env.ID;
    // const password = process.env.PASSWORD;
    // await page.evaluate((id, password) => {
    //   document.querySelector('#mb_id').value = id;
    //   document.querySelector('#mb_password').value = password;
    //   document.querySelector("form .login-button").click();
      
    // }, id, password)
    await page.type('#mb_id', process.env.ID)
    await page.type('#mb_password', process.env.PASSWORD)
    await page.hover('form .login-button')
    await page.waitFor(3000)
    await page.click('form .login-button')
    await page.waitForSelector('div.lg_pnt span')
    const res = await page.evaluate(() => {
      return document.querySelector("div.lg_pnt a").textContent
    })
    console.log(res)
    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e)
  }
}

crawler();