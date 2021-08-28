const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const config = {
  baseUrl: "http://www.suikosource.com",
};

// id = s1, s2, etc
// scrape stars of destiny table
const getSod = async (id) => {
  let data = [];
  const full = {
    sod: data,
  };
  const html = await axios.get(`${config.baseUrl}/games/sod.php?pf=${id}`);
  const $ = cheerio.load(html.data);

  $(".content table.namelist tbody > tr")
    .slice(1)
    .map(async function () {
      const name = $(this).find("td:nth-child(2)").text();
      const star = $(this).find("td:nth-child(3)").text();
      const howToRecruit = $(this).find("td:nth-child(4)").text();
      data.push({
        name,
        star,
        howToRecruit,
      });
    });
  //console.log(full);
  return full;
};

// id = gs1, gs2, etc.
// scrape gameplay guides
const getGuide = async (id) => {
  let data = [];
  const full = {
    guides: data,
  };
  const html = await axios.get(`${config.baseUrl}/games/${id}/guides/`);
  const $ = cheerio.load(html.data);

  $(".right > .content")
    .slice(1)
    .map(async function () {
      const name = $(this).find(".head a").text();
      const url = $(this).find(".head a").attr("href");
      const author = $(this).children().eq(1).text().trim();
      const description = $(this).contents().eq(2).text().trim();
      data.push({ name, description, author, url });
    });

  //console.log(full);
  return full;
};

const promises = [getSod("S4"), getGuide("gs1")];
Promise.all(promises).then((resolvedValue) => {
  const filename = "star-of-destiny.json";
  console.log(`data successfully exported to ${filename}`);
  const writableStream = fs.createWriteStream(filename);
  writableStream.write(JSON.stringify(resolvedValue));
  writableStream.end();
});
