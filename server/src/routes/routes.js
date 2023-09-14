const express = require('express');
const theBetCrawler = require('../crawler/crawler');
const router = express.Router()

/*
router.get("/testforecho", (req, res, next) => {
  try {
    res.json({ usersList: ["user1", "user2"] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
*/

router.post("/testforecho", async (req, res, next) => {
  const data = req.body
  console.log(data)

  try {
    await theBetCrawler(data);
    res.status(200).send('Bot processing completed.');
  } catch (error) {
    console.error('Bot error:', error);
    res.status(500).send('Bot encountered an error.');
  }
  
})


module.exports = router