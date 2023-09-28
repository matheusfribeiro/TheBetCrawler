const express = require('express');
const crawlerController = require('../controllers/crawler')
const router = express.Router()


router.post("/testforecho", crawlerController.postCrawler)

router.get("/downloadscreenshots", crawlerController.getDownloadScreenshots)


module.exports = router