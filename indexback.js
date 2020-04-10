const parse = require('csv-parse/lib/sync')
const xlsx = require('xlsx');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const csv = fs.readFileSync('csv/data.csv');
const workbook = xlsx.readFile('xlsx/data.xlsx');
const add_to_sheet = require('./add_to_sheet'); 


// const recodes = parse(csv.toString('utf-8'))
// recodes.forEach((r,i) => {
//   console.log(i,r);
// })

const ws = workbook.Sheets.영화목록
const recodes =  xlsx.utils.sheet_to_json(ws)


const crawlers = async() => {
  add_to_sheet(ws,'C1','s','평점');
    for (const [i,r] of recodes.entries()) {
      const response = await axios.get(r.링크);
      if(response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html)
        const text = $('.score.score_left .star_score').text();
        console.log(i+1,r.제목,'평점',text.trim())
        const newCell = 'C' + (i + 2);
        add_to_sheet(ws,newCell,'n ',parseFloat(text.trim()));

      }
    }
    xlsx.writeFile(workbook,'xlsx/result.xlsx')
  // await Promise.all(recodes.map( async (r,i) => {
 // }))
}

crawlers();