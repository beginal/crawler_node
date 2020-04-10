const puppeteer =require('puppeteer');
const axios = require('axios');
const fs =require('fs');

fs.readdir('imgs', (err) => {
  if (err) {
    console.error('imgs 폴더가 없어서 imgs 폴더를 생성합니다.')
    fs.mkdirSync('imgs')
  }
})

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://unsplash.com');
    let result = [];
    while(result.length <= 30) {

      const srcs = await page.evaluate(() => {
        let imgs = [];
        const imgEls = document.querySelectorAll('._1Nk0C')
        if(imgEls.length) {
          imgEls.forEach((img) => { 
            let src = img.querySelector('img._2zEKz').src
            if(src) {
              imgs.push(src) 
            }
            img.parentElement.removeChild(img);
          })
        }
        window.scrollBy(0,300)
        return imgs;
      })
      result = result.concat(srcs)
      await page.waitForSelector('._1Nk0C')
      console.log('새 이미지 로딩완료')
    }
    console.log(result);
    result.forEach(async (src) => {
      const imgResult = await axios.get(src.replace(/\?.*$/, ''), {
        responseType : 'arraybuffer',
      })
      fs.writeFileSync(`imgs/${new Date().valueOf()}.jpeg`, imgResult.data)
    })
    await page.close();
    await browser.close();

  } catch(e) {
    console.error(e)
  }
};
crawler();
