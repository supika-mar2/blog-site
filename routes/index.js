var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const { result } = require("pg");
const prisma = new PrismaClient();

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const blog = await prisma.blog.findMany();
    console.log(blog); // 確認
    res.render("index", { blog: blog });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

router.post("/search", async function (req, res, next) {
  try {
    console.log("受信データ：", req.body); // 確認

    const searchWord = req.body.searchWord;
    console.log("検索ワード:", searchWord); // 確認

    const result = await prisma.blog.findMany({ where: {
      OR: [{ title: { contains: searchWord }},
           { article: { contains: searchWord }}],
    },})

    console.log("検索結果:", result); // 確認

    res.render("search", { 
      searchWord: searchWord, 
      result: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

router.post("/", async function (req, res) {
  try {
    console.log(req.body); // 確認
    const { title, date, article } = req.body;

    await prisma.blog.create({
      data: {
        title: title,
        date: new Date(date),
        article: article,
      }
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating article");
  }
});

module.exports = router;
