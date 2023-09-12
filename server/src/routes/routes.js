const express = require('express')
const router = express.Router()


router.get("/testforecho", (req, res, next) => {
  try {
    res.json({ usersList: ["user1", "user2"] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.post("/testforecho", (req, res, next) => {
  console.log('ok funcinou')
  res.end
})


module.exports = router