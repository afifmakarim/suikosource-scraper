const cheerio = require('cheerio');
const axios = require('axios');
const fs = require("fs");


const config = {
    baseUrl: "http://www.suikosource.com"
}

const getSod = async (id) => {
    let data = [];
    const html = await axios.get(`${config.baseUrl}/games/sod.php?pf=${id}`);
    const $ = cheerio.load(html.data);

    $(".content table.namelist tbody > tr").slice(1).map(async function () {
            const name = $(this).find("td:nth-child(2)").text();
            const star = $(this).find("td:nth-child(3)").text();
            const howToRecruit = $(this).find("td:nth-child(4)").text();
            data.push({
                name,
                star,
                howToRecruit
            })
    })

    return data;
}

getSod('S1').then((resolvedValue) => {
  console.log(resolvedValue)

  const writableStream = fs.createWriteStream("star-of-destiny.json");
  writableStream.write(JSON.stringify(resolvedValue));
  writableStream.end();
})